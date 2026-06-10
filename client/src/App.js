import React, { useState } from 'react';
import Header from './components/Header';
import StepIndicator from './components/StepIndicator';
import Step1Upload from './components/Step1Upload';
import Step2Analyse from './components/Step2Analyse';
import Step3Questions from './components/Step3Questions';
import Step4Results from './components/Step4Results';

const STEPS = ['Upload', 'Analyse', 'Questions', 'Results'];

export default function App() {
  const [step, setStep] = useState(1);
  const [cvText, setCvText] = useState('');
  const [jdText, setJdText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [gapAnswers, setGapAnswers] = useState([]);
  const [results, setResults] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <StepIndicator steps={STEPS} current={step} />

        <div className="mt-8">
          {step === 1 && (
            <Step1Upload
              cvText={cvText}
              setCvText={setCvText}
              jdText={jdText}
              setJdText={setJdText}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Step2Analyse
              cvText={cvText}
              jdText={jdText}
              analysis={analysis}
              setAnalysis={setAnalysis}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <Step3Questions
              gaps={analysis?.gaps || []}
              gapAnswers={gapAnswers}
              setGapAnswers={setGapAnswers}
              cvText={cvText}
              jdText={jdText}
              setResults={setResults}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <Step4Results
              results={results}
              onStartOver={() => {
                setStep(1);
                setCvText('');
                setJdText('');
                setAnalysis(null);
                setGapAnswers([]);
                setResults(null);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
