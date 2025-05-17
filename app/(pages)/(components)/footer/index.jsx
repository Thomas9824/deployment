import { Link } from '@/components/link'

export function Footer() {
  return (
    <footer className="flex flex-col dt:flex-row items-center dt:items-start justify-between p-safe uppercase font-mono clear-both w-full" style={{position: 'fixed', left: 0, bottom: 0, zIndex: 100}}>
      <div>
        <Link
          href="https://www.linkedin.com/in/thomas-mionnet/"
          className="link"
        >
          Linkedin
        </Link>
        {' / '}
        <Link
          href="https://github.com/"
          className="link"
        >
          github
        </Link>
      </div>
    </footer>
  )
}
