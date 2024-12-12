import React from 'react'
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
    const { dadosCidade } = props;

    if (!dadosCidade) {
        return (
            <div className="text-center text-gray-500 p-4">
                Selecione uma cidade para ver detalhes
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto shadow-lg rounded-lg overflow-hidden">
            <Table>
                <TableCaption>Informações de {dadosCidade.Município}</TableCaption>
                <TableHeader className="bg-gray-100">
                    <TableRow>
                        <TableHead className="w-1/2">Detalhes</TableHead>
                        <TableHead className="text-right w-1/2">Valor</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Município</TableCell>
                        <TableCell className="text-right">{dadosCidade.Município}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>População</TableCell>
                        <TableCell className="text-right">
                            {parseInt(dadosCidade.Populacao).toLocaleString()}
                        </TableCell>
                    </TableRow>
                    {/* Adicione mais linhas conforme os dados disponíveis */}
                    {Object.entries(dadosCidade)
                        .filter(([key]) => !['Município', 'Populacao', 'ID'].includes(key))
                        .map(([key, value]) => (
                            <TableRow key={key}>
                                <TableCell>{key}</TableCell>
                                <TableCell className="text-right">
                                    {typeof value === 'number' ? value.toLocaleString() : value}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default Tabela