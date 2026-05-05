export default function Spinner({ size = 'md' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }
  return (
    <div className="flex justify-center items-center p-12">
      <div className={`${sizes[size]} animate-spin rounded-full border-2 border-slate-100 border-t-blue-600`} />
    </div>
  )
}
