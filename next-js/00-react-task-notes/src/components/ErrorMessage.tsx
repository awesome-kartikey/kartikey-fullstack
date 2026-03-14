interface Props {
  message: string;
}

export default function ErrorMessage({ message }: Props) {
  return (
    <div className="error">
      <p>Error: {message}</p>
    </div>
  );
}