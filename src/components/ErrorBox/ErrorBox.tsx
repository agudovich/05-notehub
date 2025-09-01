import css from "./ErrorBox.module.css";

export interface ErrorBoxProps {
  message: string;
}
export default function ErrorBox({ message }: ErrorBoxProps) {
  return <p className={css.error}>{message}</p>;
}
