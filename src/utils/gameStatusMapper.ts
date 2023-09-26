import { Filter } from "../types";

export const gameStatusMapper: Record<Filter, string> = {
  "All": "",
  "Finished": "finished",
  "In progress": "progress",
  "Open": "open"
}
