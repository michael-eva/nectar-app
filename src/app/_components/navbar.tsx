import Link from 'next/link'
import FacebookIcon from './icons/FacebookIcon'
import InstagramIcon from './icons/InstagramIcon'
import LinkedInIcon from './icons/LinkedInIcon'
import TikTokIcon from './icons/TikTokIcon'

export default function Navbar() {
    return (
        <div className="bg-black w-full p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/">
                    <img src="/nectar-logo.png" alt="nectar logo" className="h-8" />
                </Link>

                <div className="flex gap-4">
                    <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FacebookIcon />
                    </Link>
                    <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <InstagramIcon />
                    </Link>
                    <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <LinkedInIcon />
                    </Link>
                    <Link href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                        <TikTokIcon />
                    </Link>
                </div>
            </div>
        </div>
    )
}
