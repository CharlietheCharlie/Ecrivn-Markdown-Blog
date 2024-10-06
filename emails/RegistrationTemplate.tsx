import React, { CSSProperties } from 'react'
import { Html, Body, Container, Text, Link, Preview, Tailwind } from '@react-email/components'

const RegistrationTemplate = ({ name, verificationLink }: { name: string; verificationLink: string }) => {
    return (
        <Html>
            <Preview>Verify your email to complete your registration</Preview>
            <Tailwind>
                <Body className="bg-gray-100">
                    <Container>
                        <Text style={heading}>
                            Hi {name},
                        </Text>
                        <Text style={bodyText}>
                            Thank you for registering on our platform! To complete your registration, please verify your email address by clicking the link below:
                        </Text>
                        <Link href={verificationLink} style={linkStyle}>
                            Verify your email
                        </Link>
                        <Text style={bodyText}>
                            If you didn’t sign up for this account, please disregard this email.
                        </Text>
                        <Text style={bodyText}>
                            Best regards,<br />
                            The Ecrivn Team
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

const heading: CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
}

const bodyText: CSSProperties = {
    fontSize: '16px',
    lineHeight: '1.5',
    marginBottom: '20px',
}

const linkStyle: CSSProperties = {
    fontSize: '16px',
    color: '#007bff',
    textDecoration: 'underline',
}

export default RegistrationTemplate
