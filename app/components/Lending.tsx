import * as React from 'react'
import type {FC} from "react";

type LendingProps = {
   children: React.ReactNode | React.ReactNode[];
}

const Lending: FC<LendingProps> = (props) => {
    const { children } = props;
    return (
        <div>
            Lending
            {children}
        </div>
    )
}

export default Lending;
