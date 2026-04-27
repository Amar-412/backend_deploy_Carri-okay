import './Card.css';

function Card({ children, className = '', onClick, style, ...rest }) {
  return (
    <div
      className={`card-component ${className}`}
      onClick={onClick}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;

