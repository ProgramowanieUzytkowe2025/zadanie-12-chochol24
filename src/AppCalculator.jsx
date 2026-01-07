import './AppCalculator.css';
import { useState, useEffect, useReducer } from 'react';
import { AppButton } from './AppButton';
import { AppCalculationHistory } from './AppCalculationHistory';
import { useKalkulator } from './useKalkulator';

function statusReducer(action) {
    switch (action.type) {
        case 'SET_A':
            return 'Zmodyfikowano wartość liczby A';
        case 'SET_B':
            return 'Zmodyfikowano wartość liczby B';
        case 'CALCULATE':
            return 'Wykonano obliczenia';
        case 'RESTORE':
            return 'Przywrócono historyczny stan';
        default:
            return 'Brak';
    }
}

export function AppCalculator() {

    const pobierzHistorieZSesji = () => {
        try {
            const zapisanaHistoria = sessionStorage.getItem('kalkulator-historia');
            if (zapisanaHistoria) {
                return JSON.parse(zapisanaHistoria);
            }
        } catch (error) {
            console.error("Błąd odczytu z sessionStorage", error);
        }
        return [];
    };

    const [historia, setHistoria] = useState(pobierzHistorieZSesji);

    const ostatniWpis = historia.length > 0 ? historia[historia.length - 1] : null;

    const [liczbaA, setLiczbaA] = useState(ostatniWpis ? ostatniWpis.a : null);
    const [liczbaB, setLiczbaB] = useState(ostatniWpis ? ostatniWpis.b : null);
    const [wynik, setWynik] = useState(ostatniWpis ? ostatniWpis.wynik : null);

    const [porownanie, setPorownanie] = useState('');

    const [status, dispatch] = useReducer(statusReducer, 'Brak');

    useEffect(() => {
        sessionStorage.setItem('kalkulator-historia', JSON.stringify(historia));
    }, [historia]);

    const { dodaj, odejmij, pomnoz, podziel } = useKalkulator(
            liczbaA, 
            liczbaB, 
            historia, 
            setHistoria, 
            setWynik
        );

    useEffect(() => {
        if (liczbaA == null || liczbaB == null) {
            // eslint-disable-next-line
            setPorownanie('');
            return;
        }

        if (liczbaA === liczbaB) {
            setPorownanie('Liczba A jest równa liczbie B.');
        } else if (liczbaA > liczbaB) {
            setPorownanie('Liczba A jest większa od liczby B.');
        } else {
            setPorownanie('Liczba B jest większa od liczby A.');
        }
    }, [liczbaA, liczbaB]);

    function liczbaAOnChange(value) {
        setLiczbaA(parsujLiczbe(value));
        dispatch({ type: 'SET_A' });
    }

    function parsujLiczbe(value) {
        const sparsowanaLiczba = parseFloat(value);
        if(isNaN(sparsowanaLiczba)) {
            return null;
        } else {
            return sparsowanaLiczba;
        } 
    }

    function liczbaBOnChange(value) {
        setLiczbaB(parsujLiczbe(value));
        dispatch({ type: 'SET_B' });
    }

    function onAppCalculationHistoryClick(index) {
        const item = historia[index];
        const nowaHistoria = historia.slice(0, index + 1);
        
        setHistoria(nowaHistoria);
        setLiczbaA(item.a);
        setLiczbaB(item.b);
        setWynik(item.wynik);
        dispatch({ type: 'RESTORE' });
    }

    function wykonajObliczenie(akcjaZHooka) {
        akcjaZHooka();
        dispatch({ type: 'CALCULATE' });
    }

    let zablokujPrzyciski = liczbaA == null || liczbaB == null;
    let zablokujDzielenie = zablokujPrzyciski || liczbaB === 0;

    return (
    <div className='app-calculator'>

        <div className='app-calculator-pole' style={{ marginBottom: '10px', padding: '5px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}>
            <label>Ostatnia akcja: </label>
            <strong>{status}</strong>
        </div>

        <div className='app-calculator-pole'>
            <label>Wynik: </label>
            <span>{wynik}</span>
        </div>

        <hr />

        <div className='app-calculator-pole'>
            <label>Dynamiczne porównanie liczb: </label>
            <span>{porownanie}</span>
        </div>

        <hr />

        <div className='app-calculator-pole'>
            <label htmlFor="liczba1">Liczba 1</label>
            <input id="liczba1" type="number" value={liczbaA} onChange={(e) => liczbaAOnChange(e.target.value)} name="liczba1" />
        </div>
        <div className='app-calculator-pole'>
            <label htmlFor="liczba2">Liczba 2</label>
            <input id="liczba2" type="number" value={liczbaB} onChange={(e) => liczbaBOnChange(e.target.value)} name="liczba2" />
        </div>

        <hr />

        <div className='app-calculator-przyciski'>
            <AppButton disabled={zablokujPrzyciski} title="+" onClick={() => wykonajObliczenie(dodaj)}/>
            <AppButton disabled={zablokujPrzyciski} title="-" onClick={() => wykonajObliczenie(odejmij)}/>
            <AppButton disabled={zablokujPrzyciski} title="*" onClick={() => wykonajObliczenie(pomnoz)}/>
            <AppButton disabled={zablokujDzielenie} title="/" onClick={() => wykonajObliczenie(podziel)}/>
        </div>

        <hr />
        
        <div className='app-calculator-historia'>
            <AppCalculationHistory historia={historia} onClick={(index) => onAppCalculationHistoryClick(index)}/>
        </div>
    </div>)
}