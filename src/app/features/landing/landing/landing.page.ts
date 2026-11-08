import { Component } from '@angular/core';
import { ComoFuncionaComponent } from '../components/como-funciona.component';
import { CtaFinalComponent } from '../components/cta-final.component';
import { DiferenciadoresComponent } from '../components/diferenciadores.component';
import { HeroComponent } from '../components/hero.component';
import { ImpactoResumenComponent } from '../components/impacto-resumen.component';
import { LandingFooterComponent } from '../components/landing-footer.component';
import { LandingHeaderComponent } from '../components/landing-header.component';
import { ParaQuienComponent } from '../components/para-quien.component';
import { ProblemaComponent } from '../components/problema.component';

/**
 * PARTE 2 · Landing pública (EP06).
 * US21 propuesta de valor (hero) · US22 cómo funciona y beneficios · US23 registro desde la landing
 * · US24 diferenciadores y comparación · US20 contador de impacto en vivo.
 */
@Component({
  selector: 'app-landing-page',
  imports: [
    LandingHeaderComponent,
    HeroComponent,
    ProblemaComponent,
    ComoFuncionaComponent,
    ParaQuienComponent,
    ImpactoResumenComponent,
    DiferenciadoresComponent,
    CtaFinalComponent,
    LandingFooterComponent,
  ],
  template: `
    <app-landing-header />
    <main>
      <app-hero />
      <app-problema />
      <app-como-funciona />
      <app-para-quien />
      <app-impacto-resumen />
      <app-diferenciadores />
      <app-cta-final />
    </main>
    <app-landing-footer />
  `,
})
export class LandingPage {}
