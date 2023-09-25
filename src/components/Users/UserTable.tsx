import { UserData } from "../../types";
import Table from "../Generic/Table";
import UserTableRow from "./UserTableRow";

interface UserTableProps {
  users: UserData[]
}

export default function UserTable({ users }: UserTableProps) {
  const rowProps = users.map((user) => {return { user }});
  console.debug({rowProps});

  return (
    <Table items={rowProps} rowComponent={UserTableRow}/>
  )
}
