import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PiauiMapa from "./Mapa"
import Lista from "./Lista"

export default function Abas({ onCidadeSelecionadaMapa, cidadeSelecionada, mes, ano }) {

    return (
        <Tabs className="" defaultValue="ativas" >

            <TabsList className="w-full relative  flex gap-2">
                <TabsTrigger value="ativas">Empresas Ativas</TabsTrigger>
                <TabsTrigger value="abertas">Empresas Abertas</TabsTrigger>
            </TabsList>

            <TabsContent value="ativas">
                <div className="">
                    {/* <PiauiMapa onCidadeSelecionada={onCidadeSelecionadaMapa} /> */}
                    <Lista onCidadeSelecionada={cidadeSelecionada} mes={mes} ano={ano} />
                </div>
            </TabsContent>

            <TabsContent value="abertas">
                <div className="">
                    {/* <PiauiMapa onCidadeSelecionada={onCidadeSelecionadaMapa} /> */}
                    <Lista onCidadeSelecionada={cidadeSelecionada} mes={mes} ano={ano} />
                </div>
            </TabsContent>

        </Tabs>

    )
}