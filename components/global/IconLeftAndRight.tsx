
export default function IconLeftAndRight({
  className,
}:{
  className?: string
}) {
  return (
    <svg
    viewBox="0 0 24 25"
    fill="none"
    className={`rtl:rotate-180 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.25 7L14.75 12.5L9.25 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  )
}
