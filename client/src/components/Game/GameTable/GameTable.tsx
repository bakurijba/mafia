import { forwardRef, useEffect, useRef, useState } from "react";
import { GameI } from "../../../models/lobby";
import { players } from "../temporary";
import { Modal, Popover, Whisper } from "rsuite";
import { RoleId } from "../../../models/role";

const seatStyle = {
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  backgroundColor: "#3498db",
  position: "absolute",
  top: "50%",
  left: "50%",
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
        <p>This is a Popover </p>
        <p>{role}</p>
      </Popover>
    );
  }
);

const Card = () => {
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      setShowCard(true);
    }, 500);

    return () => clearTimeout(delay);
  }, []);

  return (
    <Modal open={showCard} onClose={() => setShowCard(false)}>
      <Modal.Header>Your role is:</Modal.Header>

      <Modal.Body>Mafia</Modal.Body>
    </Modal>
  );
};

interface SeatProps {
  seatPosition: { x: number; y: number };
  onClick: () => void;
  playerId: string;
  gameState: GameI["gameState"];
}

const Seat: React.FC<SeatProps> = ({
  seatPosition,
  onClick,
  playerId,
  gameState,
}) => {
  const playerName = players.find(
    (play) => play.playerId === playerId
  )!.username;

  const playerRole = gameState.roles?.get(playerId)?.roleId;

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
        <span className="absolute top-5 z-10 dark:text-white">
          {playerName}
        </span>
      </div>
    </Whisper>
  );
};

export const GameTable = ({ gameState }: GameTableProps) => {
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [tableWidth, setTableWidth] = useState(0);
  const [tableHeight, setTableHeight] = useState(0);

  const { remainingUsers } = gameState;

  const fromPlayerId = "from";

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
          onClick={() => handleAction(fromPlayerId, remainingUsers[i])}
          playerId={remainingUsers[i]}
          gameState={gameState}
        />
      );
    }

    return seats;
  };

  const handleAction = (fromPlayerId: string, toPlayerId: string) => {
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
    if (tableRef.current) {
      const { offsetWidth, offsetHeight } = tableRef.current;
      setTableWidth(offsetWidth);
      setTableHeight(offsetHeight);
    }
  }, [tableRef]);

  return (
    <div
      ref={tableRef}
      className="w-[calc(100vh-10rem)] h-[calc(100vh-10rem)] relative rounded-full mx-auto my-4 border border-black dark:border-white"
    >
      {renderSeats()}

      <Card />
    </div>
  );
};
