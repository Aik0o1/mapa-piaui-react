import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PiauiMapa from "./Mapa"
import Lista from "./Lista"
import ListaAtivas from "./ListaAtivas"

export default function Abas({ onCidadeSelecionadaMapa, cidadeSelecionada, mes, ano }) {

    return (
        <Tabs className="" defaultValue="abertas" >

            <TabsList className="w-full relative  flex gap-2">
                <TabsTrigger value="abertas">Empresas Abertas</TabsTrigger>
                <TabsTrigger value="ativas">Empresas Ativas</TabsTrigger>
            </TabsList>

            <TabsContent value="abertas">
                <div className="">
                    {/* <PiauiMapa onCidadeSelecionada={onCidadeSelecionadaMapa} /> */}
                    <Lista onCidadeSelecionada={cidadeSelecionada} mes={mes} ano={ano} />
                </div>
            </TabsContent>

            <TabsContent value="ativas">
                <div className="">
                    {/* <PiauiMapa onCidadeSelecionada={onCidadeSelecionadaMapa} /> */}
                    <ListaAtivas onCidadeSelecionada={cidadeSelecionada} mes={mes} ano={ano} />
                </div>
            </TabsContent>

        </Tabs>

    )
}