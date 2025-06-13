import * as React from 'react'
import {useAccount, useConnect} from 'wagmi'
import {useNavigate} from "react-router";
import {useEffect} from "react";

export default function Connect() {
    const { connectors, connect } = useConnect()
    const navigate = useNavigate()

    const { isConnected } = useAccount();

    useEffect(() => {
        if (isConnected) {
            navigate('/');
        }
    }, [isConnected, navigate]);

    return connectors.map((connector) => (
        <button key={connector.uid} onClick={() => connect({ connector })}>
            {connector.name}
        </button>
    ))
}