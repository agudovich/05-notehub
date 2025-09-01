import css from "./Empty.module.css";

export interface EmptyProps {
  message?: string;
}
export default function Empty({ message = "No notes found" }: EmptyProps) {
  return <p className={css.empty}>{message}</p>;
}
