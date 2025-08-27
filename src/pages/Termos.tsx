import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

const Termos = () => {
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
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-4xl font-bold text-foreground">
                  Termos de Uso
                </CardTitle>
                <p className="text-muted-foreground">
                  Última atualização: 27 de agosto de 2024
                </p>
              </CardHeader>
              
              <CardContent className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    1. Aceitação dos Termos
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Ao acessar e usar este website, você aceita e concorda em ficar vinculado aos termos 
                    e condições de uso aqui estabelecidos. Se você não concordar com qualquer parte 
                    destes termos, não deve usar este website.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    2. Verificação de Idade
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Este website contém conteúdo adulto destinado exclusivamente a pessoas maiores de 18 anos. 
                    Ao acessar este site, você declara e garante que:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Tem pelo menos 18 anos de idade</li>
                    <li>É legalmente capaz de aceitar estes termos</li>
                    <li>Não achará o conteúdo ofensivo ou censurável</li>
                    <li>Está acessando por sua própria vontade</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    3. Uso do Conteúdo
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Todo o conteúdo disponível neste website é protegido por direitos autorais. É estritamente proibido:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Reproduzir, distribuir ou modificar qualquer conteúdo sem autorização</li>
                    <li>Usar o conteúdo para fins comerciais sem permissão expressa</li>
                    <li>Fazer download ou captura de tela do conteúdo</li>
                    <li>Compartilhar credenciais de acesso com terceiros</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    4. Conduta do Usuário
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Você concorda em não usar este website para:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Atividades ilegais ou que violem regulamentos locais</li>
                    <li>Assediar, ameaçar ou prejudicar outros usuários</li>
                    <li>Transmitir vírus ou código malicioso</li>
                    <li>Tentar acessar áreas restritas do sistema</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    5. Privacidade e Dados
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Respeitamos sua privacidade e nos comprometemos a proteger suas informações pessoais. 
                    Para mais detalhes sobre como coletamos, usamos e protegemos seus dados, 
                    consulte nossa Política de Privacidade.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    6. Limitação de Responsabilidade
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Este website é fornecido "como está" sem garantias de qualquer tipo. 
                    Não nos responsabilizamos por danos diretos, indiretos, incidentais ou consequenciais 
                    resultantes do uso ou impossibilidade de uso deste website.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    7. Modificações dos Termos
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Reservamos o direito de modificar estes termos a qualquer momento. 
                    As mudanças entrarão em vigor imediatamente após a publicação. 
                    O uso continuado do website após as modificações constitui aceitação dos novos termos.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    8. Contato
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Para questões relacionadas a estes termos, entre em contato através do email: {"{EMAIL_COMERCIAL}"}
                  </p>
                </section>

                <div className="border-t border-white/10 pt-8 text-center">
                  <p className="text-sm text-muted-foreground mb-6">
                    Ao continuar a usar este website, você confirma que leu, compreendeu e concorda 
                    com estes Termos de Uso.
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

export default Termos;