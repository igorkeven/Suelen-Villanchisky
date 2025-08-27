import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

const Privacidade = () => {
  return (
    <div className="min-h-screen bg-background lg:pt-16">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Link>

            <Card className="glass-card">
              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-4xl font-bold text-foreground">
                  Política de Privacidade
                </CardTitle>
                <p className="text-muted-foreground">
                  Última atualização: 27 de agosto de 2024
                </p>
              </CardHeader>
              
              <CardContent className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    1. Informações que Coletamos
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Coletamos informações limitadas para melhorar sua experiência no site:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li><strong>Informações de verificação:</strong> Confirmação de idade (18+) armazenada localmente no seu dispositivo</li>
                    <li><strong>Dados de navegação:</strong> Páginas visitadas, tempo de permanência (através de analytics)</li>
                    <li><strong>Informações técnicas:</strong> Tipo de dispositivo, navegador, resolução de tela</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    2. Como Usamos suas Informações
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Utilizamos as informações coletadas exclusivamente para:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Garantir conformidade legal (verificação 18+)</li>
                    <li>Melhorar a experiência do usuário</li>
                    <li>Analisar tendências de uso do website</li>
                    <li>Otimizar performance e funcionalidades</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    3. Armazenamento Local
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Utilizamos localStorage do seu navegador para armazenar sua preferência de verificação de idade. 
                    Esta informação fica apenas no seu dispositivo e pode ser removida a qualquer momento 
                    através das configurações do navegador.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibond text-foreground mb-4">
                    4. Analytics sem Cookies
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Utilizamos serviços de analytics que respeitam sua privacidade, sem uso de cookies de tracking. 
                    Os dados coletados são agregados e anônimos, focando em métricas de uso geral do website.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    5. Compartilhamento de Dados
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Não compartilhamos, vendemos ou alugamos suas informações pessoais para terceiros. 
                    Suas informações podem ser compartilhadas apenas em casos específicos:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Quando exigido por lei ou ordem judicial</li>
                    <li>Para proteger nossos direitos legais</li>
                    <li>Em caso de emergência para proteger a segurança pública</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    6. Plataformas Terceiras
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Este website contém links para plataformas parceiras onde o conteúdo premium está hospedado. 
                    Cada plataforma possui suas próprias políticas de privacidade, sobre as quais recomendamos 
                    que você se informe antes de criar conta ou fazer transações.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    7. Segurança dos Dados
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Implementamos medidas de segurança adequadas para proteger suas informações contra 
                    acesso não autorizado, alteração, divulgação ou destruição. Isso inclui 
                    criptografia de dados em trânsito e práticas de segurança em nossos serviços.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    8. Seus Direitos
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Você tem os seguintes direitos em relação aos seus dados:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Limpar dados armazenados localmente através do navegador</li>
                    <li>Solicitar informações sobre dados coletados</li>
                    <li>Solicitar correção de informações incorretas</li>
                    <li>Opt-out de analytics através de configurações do navegador</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    9. Menores de Idade
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Este website é estritamente destinado a maiores de 18 anos. 
                    Não coletamos intencionalmente informações de menores de idade. 
                    Se tomarmos conhecimento de que coletamos dados de menores, 
                    tomaremos medidas imediatas para excluir essas informações.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    10. Mudanças nesta Política
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Podemos atualizar esta Política de Privacidade periodicamente. 
                    Notificaremos sobre mudanças significativas através do website. 
                    Recomendamos revisar esta página regularmente para se manter informado.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    11. Contato
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Para questões sobre esta Política de Privacidade ou sobre o tratamento de seus dados, 
                    entre em contato através do email: {"{EMAIL_COMERCIAL}"}
                  </p>
                </section>

                <div className="border-t border-white/10 pt-8 text-center">
                  <p className="text-sm text-muted-foreground mb-6">
                    Ao usar este website, você reconhece que leu e compreendeu esta Política de Privacidade.
                  </p>
                  
                  <Link to="/">
                    <Button className="premium-button">
                      Voltar ao Site
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacidade;