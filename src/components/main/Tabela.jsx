import React, { useState, Fragment } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


function Tabela(props) {
    return (
        <Fragment>
            <div className="tabela">
            {props.dadosCidade &&

<Table>
<TableCaption>{props.dadosCidade.ID}</TableCaption>
<TableHeader>
    <TableRow>
        <TableHead>Município</TableHead>
        <TableHead>População</TableHead>
        <TableHead className="text-right">Amount</TableHead>
    </TableRow>
</TableHeader>
<TableBody>
    <TableRow>
        <TableCell>{props.dadosCidade.Município}</TableCell>
        <TableCell className="text-right">{props.dadosCidade.Populacao}</TableCell>
    </TableRow>
</TableBody>
</Table>

            
            }
                

            </div>
        </Fragment>
    )
}

export default Tabela  