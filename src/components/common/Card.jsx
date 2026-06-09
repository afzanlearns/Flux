const Card = ({ className = '', children, onClick, hoverable = false, padding = true }) => {
  return (
    <div
      onClick={onClick}
      className={`
        card
        ${hoverable || onClick ? 'card-hover' : ''}
        ${padding ? '' : '!p-0'}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default Card
