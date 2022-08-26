import React from 'react'

import { SignInButton } from '../common/SignInSignButton'
import { LandingLayout } from './LandingLayout'

export const UnauthenticatedLayout = () => {
    return (
        <LandingLayout>
            <p>Not Authenticated, please login</p>
            <SignInButton />
        </LandingLayout>
    )
}
