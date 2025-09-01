import css from "./Loader.module.css";

export interface LoaderProps {
  label?: string;
}
export default function Loader({ label = "Loading..." }: LoaderProps) {
  return <p className={css.loader}>{label}</p>;
}
