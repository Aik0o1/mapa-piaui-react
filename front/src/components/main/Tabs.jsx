import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Lista from "./Lista";
import ListaAtivas from "./ListaAtivas";
import ListaRanking from "./ListaRanking";

export default function Abas({
  cidadeSelecionada,
  mes,
  ano,
}) {
  return (
    <Tabs defaultValue="ativas">
      <TabsList className="w-full relative  flex gap-2">
        <TabsTrigger value="ativas">Empresas Ativas</TabsTrigger>
        <TabsTrigger value="abertas">Abertura de Empresas</TabsTrigger>
        <TabsTrigger value="ranking">Ranking</TabsTrigger>
      </TabsList>

      <TabsContent value="ativas">
        <ListaAtivas onCidadeSelecionada={cidadeSelecionada} />
      </TabsContent>

      <TabsContent value="abertas">
        <Lista onCidadeSelecionada={cidadeSelecionada} mes={mes} ano={ano} />
      </TabsContent>

      <TabsContent value="ranking">
        <ListaRanking
          onCidadeSelecionada={cidadeSelecionada}
          mes={mes}
          ano={ano}
        />
      </TabsContent>
    </Tabs>
  );
}
