import { ComboboxCidades } from '../ui/combobox'
import React, { useState, useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function Filtros(props) {
    return (
        <div className="filtros">
            <p>Selecione um municipio ou período</p>
            <div className="selecao">
                <ComboboxCidades className="municipio"
                />
                <Select className="mes">
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione um mês" />
                    </SelectTrigger>
                    <SelectContent>
                        {(props.meses).map((mes, index) => (
                            <SelectItem key={index} value={mes}>
                                {mes}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select className="ano">
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione um ano" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>

                    </SelectContent>
                </Select>

            </div>
        </div>
    )
}