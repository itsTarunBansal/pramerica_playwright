import { Box, CssBaseline, CssVarsProvider } from '@mui/joy'
import React from 'react'

interface Props{
    children:any;
}
const ResponsiveBox: React.FC<Props> = ({children}) => {
    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box sx={{ display: 'flex', minHeight: '85dvh' }}>
                <Box
                    component="main"
                    className="MainContent"
                    sx={{
                        px: { xs: 2, md: 3 },
                        pt: {
                            xs: 'calc(12px + var(--Header-height))',
                            sm: 'calc(12px + var(--Header-height))',
                            md: 3,
                        },
                        pb: { xs: 2, sm: 2, md: 3 },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        height: '85dvh',
                        gap: 1,
                    }}
                >
                    {children}
                </Box>
            </Box>
        </CssVarsProvider>
    )
}

export default ResponsiveBox