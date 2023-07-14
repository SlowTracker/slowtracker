
import { NextResponse } from 'next/server'
import Airtable from "airtable";


Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_PERSONAL_TOKEN
});
const base = Airtable.base(process.env.AIRTABLE_BASE_ID || "");


const getNeeds = async (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const needs: any[] = []

        base('Potrzeby').select({
            maxRecords: 100,
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.

            records.forEach(function (record) {
                needs.push(record.get("Nazwa potrzeby"))
            });

            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage();

        }, function done(err) {
            if (err) {
                console.error(err);

                reject(err)
            }
        });

        resolve(needs);
    })
}

export type Need = {
    id: string
    label: string,
    category: string,
    description: string
}

const getNeedsStatic = (): Need[] => {
    const rawNeeds = [
        ['powietrze','Potrzeby fizyczne','niezbędne do życia'],
        ['woda','Potrzeby fizyczne','niezbędna do życia'],
        ['jedzenie','Potrzeby fizyczne','substancje konsumowane dla odżywienia'],
        ['ruch/ćwiczenia','Potrzeby fizyczne','aktywność fizyczna dla zdrowia i dobrego samopoczucia'],
        ['odpoczynek/sen','Potrzeby fizyczne','czas na regenerację i relaks'],
        ['ekspresja seksualna','Potrzeby fizyczne','wyrażanie swojej seksualności'],
        ['bezpieczeństwo fizyczne','Potrzeby fizyczne','odczucie, że jesteś chroniony przed szkodą'],
        ['schronienie','Potrzeby fizyczne','miejsce, które zapewnia ochronę przed warunkami zewnętrznymi'],
        ['dotyk','Potrzeby fizyczne','kontakt fizyczny, który może przynosić poczucie bliskości i komfortu'],
        ['świadomość','Kontaktu z samym sobą','zdolność do zauważania, myślenia, odczuwania'],
        ['celebracja życia','Kontaktu z samym sobą','świętowanie i cieszenie się życiem'],
        ['wyzwanie','Kontaktu z samym sobą','trudna sytuacja, która wymaga wysiłku, aby ją pokonać'],
        ['jasność','Kontaktu z samym sobą','stan bycia jasnym, zrozumiałym'],
        ['kompetencja','Kontaktu z samym sobą','zdolność do dobrze wykonania czegoś'],
        ['wkład','Kontaktu z samym sobą','coś, co dajesz lub robisz, aby pomóc osiągnąć cel'],
        ['kreatywność','Kontaktu z samym sobą','zdolność do tworzenia nowych pomysłów, rzeczy'],
        ['odkrycie','Kontaktu z samym sobą','proces dowiadywania się, odkrywania czegoś nowego'],
        ['osiągnięcia / satysfakcja / spełnienie','Kontaktu z samym sobą','Osiągnięcia - w kontekście kontaktu z samym sobą, potrzeba osiągnięć odnosi się do pragnienia samorealizacji i samoakceptacji poprzez osiągnięcia. To oznacza osiąganie celów, które są zgodne z naszymi wartościami i aspiracjami, które z kolei wpływają na nasze poczucie tożsamości i samopoczucia. Mogą to być cele związane z rozwojem osobistym, zdrowiem, relacjami, karierą, hobby, czy duchowością. Ta potrzeba jest związana z chęcią zrozumienia siebie, rozwijania swojego potencjału i osiągania własnej wersji sukcesu.'],
        ['wzrost','Kontaktu z samym sobą','proces stawania się większym, silniejszym, bardziej zaawansowanym'],
        ['nadzieja','Kontaktu z samym sobą','oczekiwanie, że coś dobrego się wydarzy'],
        ['uczenie się','Kontaktu z samym sobą','proces zdobywania wiedzy lub umiejętności'],
        ['żałoba','Kontaktu z samym sobą','proces czucia i wyrażania bólu po stracie'],
        ['uczestnictwo','Kontaktu z samym sobą','bycie aktywnym członkiem grupy, społeczności'],
        ['cel','Kontaktu z samym sobą','coś, co chcesz osiągnąć'],
        ['autoekspresja','Kontaktu z samym sobą','pokazywanie swoich uczuć, myśli, pomysłów'],
        ['stymulacja','Kontaktu z samym sobą','coś, co pobudza zainteresowanie, myślenie'],
        ['znaczenie','Kontaktu z samym sobą','uczucie, że jesteś ważny, że coś, co robisz, ma wartość'],
        ['zrozumienie','Kontaktu z samym sobą','zdolność do pojmowania idei, sytuacji.'],
        ['sens','Kontaktu z samym sobą','poczucie, że nasze życie ma cel i znaczenie, że nasze działania i doświadczenia są ważne i mają wartość'],
        ['autentyczność','Kontaktu z samym sobą','bycie prawdziwym, autentycznym'],
        ['integralność','Kontaktu z samym sobą','postępowanie zgodnie z własnymi wartościami i zasadami'],
        ['obecność','Kontaktu z samym sobą','bycie tu i teraz, uważność'],
        ['radość','Radości życia','poczucie szczęścia, zadowolenia'],
        ['humor','Radości życia','umiejętność dostrzeżenia i wyrażenia tego, co zabawne'],
        ['zabawa','Radości życia','odczucie radości, zadowolenia wynikające z dowolnej aktywności, która jest dla nas rozrywkowa'],
        ['łatwość','Radości życia','poczucie, że życie płynie bez trudności, problemów, że czujemy się swobodni i nieskrępowani'],
        ['przygoda','Radości życia','emocje związane z nowymi, ekscytującymi i nieprzewidywalnymi doświadczeniami, które niosą za sobą ryzyko i niepewność'],
        ['różnorodność, urozmaicenia','Radości życia','potrzeba zmienności, doświadczania różnych rzeczy, unikania monotonii i rutyny'],
        ['inspiracja','Radości życia','poczucie pobudzenia do działania, twórczości lub myślenia wynikające z doświadczania czyjegoś dzieła, piękna natury, głębokiej rozmowy itp.'],
        ['prostota','Radości życia','preferencja dla rzeczy, które są nieskomplikowane, łatwe do zrozumienia i zarządzania, zasada minimalizmu'],
        ['dobrostan fizyczny / emocjonalny','Radości życia','stan, w którym ciało jest zdrowe, a emocje są w równowadze, a człowiek czuje się generalnie dobrze'],
        ['komfort / wygoda','Radości życia','stan, w którym jest się wolnym od fizycznego dyskomfortu lub trudności, gdzie otoczenie jest przyjemne i sprzyja relaksacji'],
        ['nadzieja','Radości życia','oczekiwanie na pozytywne wydarzenia w przyszłości, przekonanie, że rzeczy mogą się poprawić'],
        ['wybór','Autonomii','możliwość wyboru własnych planów, celów, marzeń i wartości oraz drogi prowadzącej do ich realizacji'],
        ['wolność','Autonomii','stan, w którym jesteś wolny od ograniczeń'],
        ['niezależność','Autonomii','zdolność do samodzielnego myślenia lub działania'],
        ['przestrzeń','Autonomii','możliwość bycia samemu, niezakłóconemu'],
        ['spontaniczność','Autonomii','umiejętność robienia rzeczy bez planowania z góry, naturalnie'],
        ['akceptacja','Związku z innymi ludźmi','przyjęcie kogoś lub czegoś takim, jakim jest'],
        ['uczucie','Związku z innymi ludźmi','emocje wyrażające sympatię, miłość lub przywiązanie'],
        ['uznanie','Związku z innymi ludźmi','docenienie czyjegoś wkładu, osiągnięć lub wartości'],
        ['poczucie przynależności','Związku z innymi ludźmi','odczucie, że jesteś częścią grupy lub społeczności'],
        ['współpraca','Związku z innymi ludźmi','działanie razem w celu osiągnięcia wspólnego celu'],
        ['komunikacja','Związku z innymi ludźmi','wymiana informacji, myśli lub uczuć'],
        ['bliskość','Związku z innymi ludźmi','poczucie bliskiej relacji lub intymności z kimś'],
        ['społeczność','Związku z innymi ludźmi','grupa osób o wspólnych interesach, celach lub wartościach'],
        ['towarzystwo','Związku z innymi ludźmi','bycie w towarzystwie innych'],
        ['współczucie','Związku z innymi ludźmi','zdolność do odczuwania emocji innych i chęć pomocy'],
        ['uwzględnienie','Związku z innymi ludźmi','branie pod uwagę czyichś uczuć, myśli lub potrzeb'],
        ['konsekwencja','Związku z innymi ludźmi','konsekwentność w działaniach, postępowaniu'],
        ['empatia','Związku z innymi ludźmi','zdolność do rozumienia i dzielenia się uczuciami innych'],
        ['inkluzja','Związku z innymi ludźmi','akceptacja i włączanie wszystkich osób, niezależnie od ich różnic'],
        ['intymność','Związku z innymi ludźmi','bliska, osobista relacja lub znajomość'],
        ['miłość','Związku z innymi ludźmi','silne uczucie przywiązania, troski i namiętności do kogoś'],
        ['wzajemność','Związku z innymi ludźmi','zasada, że obie strony dają i otrzymują równo'],
        ['pielęgnacja','Związku z innymi ludźmi','opieka nad kimś, pomaganie mu rosnąć lub rozwijać się'],
        ['szacunek/samouznanie','Związku z innymi ludźmi','poczucie własnej wartości, zasługiwania na szacunek'],
        ['bezpieczeństwo','Związku z innymi ludźmi','odczucie, że nie jesteś zagrożony'],
        ['pewność','Związku z innymi ludźmi','odczucie, że jesteś chroniony przed ryzykiem, szkodą lub stratą'],
        ['stabilność','Związku z innymi ludźmi','odczucie, że rzeczy są stałe, niezmienne'],
        ['wsparcie','Związku z innymi ludźmi','pomoc, zachęta lub pocieszenie'],
        ['poznanie i bycie znanym','Związku z innymi ludźmi','chęć zrozumienia innych i bycia rozumianym przez innych'],
        ['widzenie i bycie widzianym','Związku z innymi ludźmi','chęć bycia zauważonym, rozpoznawanym'],
        ['rozumienie i bycie zrozumianym','Związku z innymi ludźmi','chęć zrozumienia innych i bycia rozumianym przez innych'],
        ['zaufanie','Związku z innymi ludźmi','pewność, że można polegać na kimś lub czymś'],
        ['ciepło','Związku z innymi ludźmi','przyjemne, uprzejme traktowanie'],
        ['informacja zwrotna','Związku z innymi ludźmi','Informacji zwrotnej, czy nasze działania przyczyniły się do wzbogacania życia'],
        ['piękno','Związku ze światem','cecha czyjegoś wyglądu lub czegoś, co sprawia przyjemność zmysłom'],
        ['kontakt z przyrodą','Związku ze światem','głębokie poczucie jedności z innymi istotami lub naturą'],
        ['spokój','Związku ze światem','stan braku stresu, napięcia lub niepokoju'],
        ['równość','Związku ze światem','stan, w którym wszyscy są traktowani tak samo i mają takie same prawa'],
        ['harmonia','Związku ze światem','stan równowagi i zgody'],
        ['inspiracja','Związku ze światem','coś, co motywuje do twórczych lub pozytywnych działań'],
        ['porządek','Związku ze światem','uporządkowany, zorganizowany stan rzeczy'],
    ]

    const needs = rawNeeds.map(need => {
        return {
            id: `${need[0]}-${need[1]}`,
            label: need[0],
            category: need[1],
            description: need[2]
        }
    })

    return needs
}

export type NeedsByCategory = {
    category: string,
    needs: Need[]
}

const getNeedsByCategory = (needs: Need[]): NeedsByCategory[] => {
    const categories = needs.map(need => need.category)
    // @ts-ignore
    const uniqueCategories = [...new Set(categories)]

    const needsByCategory = uniqueCategories.map(category => {
        const needsInCategory = needs.filter(need => need.category === category)

        return {
            category,
            needs: needsInCategory
        }
    })

    return needsByCategory
}

export async function GET(request: Request) {
    const needs = getNeedsStatic();
    const needsByCategory = getNeedsByCategory(needs)
    return NextResponse.json(needsByCategory)
}
