import React, {useState} from 'react';
import {lfiSecure} from '../routes/lfi-secure';

export default function LFISecureView() {
    const [input, setInput] = useState({filename: ''});
    const [result, setResult] = useState(null);

    function handleSubmit(e) {
        e.preventDefault();
        setResult(lfiSecure(input));
    }

    return (
        <section className="card">
            <h4>LFI (Sécurisé)</h4>
            <form onSubmit={handleSubmit} className="demo-form">
                <label>
                    Nom du fichier :
                    <input
                        type="text"
                        value={input.filename}
                        onChange={e => setInput({...input, filename: e.target.value})}
                        name="filename"
                        autoComplete="off"
                    />
                </label>
                <button type="submit">Tester</button>
            </form>
            {result && (
                <pre className="result">{JSON.stringify(result, null, 2)}</pre>
            )}
        </section>
    );
}

