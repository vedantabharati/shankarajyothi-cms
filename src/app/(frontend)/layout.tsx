import React from 'react'
import './styles.css'

export const metadata = {
  title: 'Shaankara Jyothi Prakasha | The Adi Shankara Cultural Corridor',
  description: 'Retracing Adi Shankaracharya\'s journeys across Bharata — connecting knowledge traditions, institutions, and communities through the vision of Advaita and National Integration.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
