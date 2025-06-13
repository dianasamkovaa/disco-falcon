import * as React from 'react'
import {useConnect} from 'wagmi'
import Lending from "~/components/Lending";
import {Button} from "@mui/material";

export default function Connect() {
    const { connectors, connect } = useConnect()

    return (
        <>
            <Lending>
                <div className="flex gap-2 items-center">
                    {
                        connectors.map((connector) => (
                            <Button variant="contained" key={connector.uid} onClick={() => connect({ connector })}>
                                {connector.name}
                            </Button>
                        ))
                    }
                </div>

            </Lending>
        </>
    )
}