import { UserData } from "../../types";

interface UserTableRowProps {
  user: UserData;
}

export default function UserTableRow({user}: UserTableRowProps) {
  const { id, username, game_count, win_rate } = user;

  return (
    <div>
      {id} - {username} - {game_count} - {win_rate}
    </div>
  )
}
