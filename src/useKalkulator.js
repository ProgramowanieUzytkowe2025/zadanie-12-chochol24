export function useKalkulator(liczbaA, liczbaB, historia, setHistoria, setWynik) {
    
    const aktualizujHistorie = (operation, wynikOperacji) => {
        const nowaHistoria = [
            ...historia, 
            { a: liczbaA, b: liczbaB, operation: operation, wynik: wynikOperacji }
        ];
        setHistoria(nowaHistoria);
        setWynik(wynikOperacji);
    };

    const dodaj = () => {
        aktualizujHistorie('+', liczbaA + liczbaB);
    };

    const odejmij = () => {
        aktualizujHistorie('-', liczbaA - liczbaB);
    };

    const pomnoz = () => {
        aktualizujHistorie('*', liczbaA * liczbaB);
    };

    const podziel = () => {
        if (liczbaB !== 0) {
            aktualizujHistorie('/', liczbaA / liczbaB);
        }
    };

    return {
        dodaj,
        odejmij,
        pomnoz,
        podziel
    };
}