import { forwardRef, useEffect, useRef, useState } from "react";
import { GameI } from "../../models/lobby";
import { Popover, Whisper } from "rsuite";
import { RoleId } from "../../models/role";

import { socket } from "../../socket";
import { assert } from "../../utils/assert";

import { GameState } from "../../models/game-state";

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

interface GameTableProps {
  gameState: GameI["gameState"];
}

interface PopoverProps {
  role?: RoleId;
}

const ActionPopover = forwardRef<HTMLDivElement, PopoverProps>(
  ({ role, ...props }, ref) => {
    return (
      <Popover ref={ref} title="Title" {...props}>
        <p>{role}</p>
      </Popover>
    );
  }
);

interface SeatProps {
  seatPosition: { x: number; y: number };
  onClick: () => void;
  playerId: string;
  gameState: GameI["gameState"];
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
      speaker={<ActionPopover role={playerRole} />}
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

export const GameTable = ({ gameState }: GameTableProps) => {
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [tableWidth, setTableWidth] = useState(0);
  const [tableHeight, setTableHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
    </div>
  );
};
