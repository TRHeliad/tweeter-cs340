interface Props {
  label: string;
  type?: string;
  id?: string;
  ["aria-label"]?: string;
  className?: string;
  size?: number;
  placeholder?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthenticationField = (props: Props) => {
  return (
    <div className="form-floating">
      <input
        type={props.type}
        className={props.className}
        size={props.size}
        id={props.id}
        aria-label={props["aria-label"]}
        placeholder={props.placeholder}
        onKeyDown={props.onKeyDown}
        onChange={props.onChange}
      />
      <label htmlFor={props.id}>{props.label}</label>
    </div>
  );
};

export default AuthenticationField;
