import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PiauiMapa from "./Mapa";
import Lista from "./Lista";
import ListaAtivas from "./ListaAtivas";
import ListaRanking from "./ListaRanking";

export default function Abas({
  onCidadeSelecionadaMapa,
  cidadeSelecionada,
  mes,
  ano,
}) {
  return (
    <Tabs className="" defaultValue="ativas">
      <TabsList className="w-full relative  flex gap-2">
        <TabsTrigger value="ativas">Empresas Ativas</TabsTrigger>
        <TabsTrigger value="abertas">Abertura de Empresas</TabsTrigger>
        <TabsTrigger value="ranking">Ranking</TabsTrigger>
      </TabsList>

      <TabsContent value="ativas">
        <div className="">
          <ListaAtivas
            onCidadeSelecionada={cidadeSelecionada}
            mes={mes}
            ano={ano}
          />
        </div>
      </TabsContent>

      <TabsContent value="abertas">
        <div className="">
          <Lista onCidadeSelecionada={cidadeSelecionada} mes={mes} ano={ano} />
        </div>
      </TabsContent>

      <TabsContent value="ranking">
        <div className="">
          <ListaRanking
            onCidadeSelecionada={cidadeSelecionada}
            mes={mes}
            ano={ano}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
