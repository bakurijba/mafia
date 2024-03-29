import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Lobby } from "../../models/lobby";
import { Popover, Whisper } from "rsuite";
import { RoleId } from "../../models/role";

import { socket } from "../../socket";
import { assert } from "../../utils/assert";

import { GameState } from "../../models/game-state";
import { useUnit } from "effector-react";
import { $gameState } from "../../store/lobby";

import "./GameTable.css";

const seatStyle = {
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  backgroundColor: "#3498db",
  color: "white",
  position: "absolute",
  transform: "translate(-50%, -50%)",
} as const;

const cardStyle = {
  width: "50px",
  height: "80px",
  backgroundColor: "#e74c3c",
  color: "white",
  borderRadius: "8px",
  position: "absolute",
  transform: "translate(-50%, -50%)",
  zIndex: 1,
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
  transition: "all 1s",
} as const;

interface PopoverProps {
  role?: RoleId;
  userId: string;
  gameState: Lobby["gameState"];
}

const ActionPopover = forwardRef<HTMLDivElement, PopoverProps>(
  ({ role, userId, ...props }, ref) => {
    const notMe = userId !== socket.id;

    const content = useMemo(() => {
      if (notMe) {
        if (
          role === RoleId.DETECTIVE ||
          role === RoleId.TOWNPERSON ||
          role === RoleId.DOCTOR
        ) {
          return <div>Kill</div>;
        }
      }

      return <div>Teammate</div>;
    }, [notMe, role]);

    return (
      <Popover ref={ref} {...props}>
        {content}
      </Popover>
    );
  }
);

interface SeatProps {
  seatPosition: { x: number; y: number };
  onClick: () => void;
  playerId: string;
  gameState: Lobby["gameState"];
}

const getRoleName = (gameState: GameState, playerId: string) => {
  const playerRole = gameState.roles?.[playerId]?.roleId;
  const myRole = gameState.roles?.[socket.id || ""]?.roleId;

  const isRoleVisible =
    (playerRole === RoleId.DON || playerRole === RoleId.MAFIA) &&
    (myRole === RoleId.DON || myRole === RoleId.MAFIA);

  if (isRoleVisible) {
    switch (playerRole) {
      case RoleId.MAFIA:
        return "Mafia";

      case RoleId.DON:
        return "Don";

      default:
        return "";
    }
  }

  return "";
};

const Seat: React.FC<SeatProps> = ({
  seatPosition,
  onClick,
  playerId,
  gameState,
}) => {
  const players = gameState.remainingUsers || [];
  const playerName = players.find((play) => play.id === playerId)?.username;

  const playerRole = gameState.roles?.[playerId]?.roleId;
  const roleName = getRoleName(gameState, playerId);

  return (
    <Whisper
      trigger="click"
      placement={"auto"}
      controlId={`control-id-${"auto"}`}
      speaker={
        <ActionPopover
          role={playerRole}
          userId={playerId}
          gameState={gameState}
        />
      }
    >
      <div
        role="button"
        style={{
          ...seatStyle,
          top: seatPosition.y,
          left: seatPosition.x,
        }}
        onClick={onClick}
      >
        <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 dark:text-white">
          <span>{playerName}</span>

          {roleName}
        </div>
      </div>
    </Whisper>
  );
};

export const GameTable = () => {
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [tableWidth, setTableWidth] = useState(0);
  const [tableHeight, setTableHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const gameState = useUnit($gameState);

  const { remainingUsers } = gameState;

  const fromPlayerId = socket.id;

  const renderSeats = () => {
    const seats = [];

    for (let i = 0; i < remainingUsers.length; i++) {
      const angle = (i * 360) / remainingUsers.length;

      const seatPosition = calculateSeatPosition(
        angle,
        tableWidth,
        tableHeight
      );

      seats.push(
        <Seat
          key={i}
          seatPosition={seatPosition}
          onClick={() => handleAction(remainingUsers[i].id, fromPlayerId)}
          playerId={remainingUsers[i].id}
          gameState={gameState}
        />
      );
    }

    return seats;
  };

  const renderCards = () => {
    const gameStarted = gameState.gameStarted;

    // If the game has not started, position cards in the center
    const centerPosition = {
      x: tableWidth / 2,
      y: tableHeight / 2,
    };

    const initialCardStyle = {
      ...cardStyle,
      top: centerPosition.y,
      left: centerPosition.x,
    };

    const cards = remainingUsers.map((user, index) => {
      const angle = (index * 360) / remainingUsers.length;
      const cardPosition = calculateSeatPosition(
        angle,
        tableWidth,
        tableHeight
      );

      return (
        <div
          key={`card-${index}`}
          style={{
            ...initialCardStyle,
            transform: `translate(-50%, -50%) translate(0, ${index * 10}px)`,
            top: gameStarted ? cardPosition.y : tableWidth / 2,
            left: gameStarted ? cardPosition.x : tableWidth / 2,
          }}
          className="flex items-center justify-center"
        >
          {gameState.roles?.[user.id]?.name || ""}
        </div>
      );
    });

    return cards;
  };

  const handleAction = (toPlayerId: string, fromPlayerId?: string) => {
    assert(fromPlayerId, "socket is not connected");

    if (toPlayerId === fromPlayerId) {
      return console.log("its me");
    }

    console.log(fromPlayerId, toPlayerId);
  };

  const calculateSeatPosition = (
    angle: number,
    width: number,
    height: number
  ) => {
    const radius = Math.min(width, height) / 2;

    const x = width / 2 + radius * Math.cos((angle * Math.PI) / 180);
    const y = height / 2 + radius * Math.sin((angle * Math.PI) / 180);

    return { x, y };
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      const { offsetWidth, offsetHeight } = tableRef.current;
      setTableWidth(offsetWidth);
      setTableHeight(offsetHeight);
    }
  }, [tableRef, windowWidth]);

  return (
    <div
      ref={tableRef}
      className="game-table-container w-[calc(100vh-10rem)] h-[calc(100vh-10rem)] relative rounded-full mx-auto my-4 border border-black dark:border-white"
    >
      {renderSeats()}
      {renderCards()}
    </div>
  );
};
