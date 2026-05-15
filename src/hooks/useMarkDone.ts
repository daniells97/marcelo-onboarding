import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOnboardingStore } from '../store/onboardingStore';
import { useToast } from '../components/ui/Toast';
import type { StepKey } from '../types/onboarding';

const BASE_URL = import.meta.env.VITE_N8N_BASE_URL as string;
const DEFAULT_LOC = import.meta.env.VITE_DEFAULT_LOCATION_ID as string;

export function useMarkDone(stepKey: StepKey) {
  const { steps, setStep } = useOnboardingStore();
  const toast = useToast();
  const navigate = useNavigate();
  const { locationId } = useParams<{ locationId: string }>();

  const loc = new URLSearchParams(window.location.search).get('loc') ?? DEFAULT_LOC;

  const [verificando, setVerificando] = useState(false);
  const [showGmailModal, setShowGmailModal] = useState(false);
  const [proveedor, setProveedor] = useState('Google Meet');
  const [showRedesModal, setShowRedesModal] = useState(false);
  const [redesData, setRedesData] = useState({ pagina: '', logo: '' });

  const status = steps[stepKey];

  const sendValidador = async (valor: string) => {
    await fetch(`${BASE_URL}/onboarding-save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locationId: loc,
        validador_paso: stepKey,
        validador_valor: valor,
      }),
    }).catch(e => console.error('Error guardando validador:', e));
  };

  const markUndone = async () => {
    await sendValidador('no');
    setStep(stepKey, false);
    toast({ title: 'Paso marcado como pendiente' });
  };

  const markDone = async () => {
    if (stepKey === 'gmail') {
      setVerificando(true);
      try {
        const res = await fetch(`${BASE_URL}/onboarding-process`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trigger: 'verificar_calendario', locationId: loc }),
        });
        const text = await res.text();
        const cleanText = text.trim().replace(/^=/, '');
        console.log('RESPUESTA RAW:', cleanText);
        let data: { status: string; proveedor?: string };
        try {
          data = JSON.parse(cleanText);
        } catch {
          console.error('Error parseando:', text);
          toast({ title: 'Error al procesar la respuesta del servidor.' });
          return;
        }
        if (data.status === 'ok') {
          setProveedor(data.proveedor || 'Google Meet');
          await sendValidador('si');
          setStep(stepKey, true);
          setShowGmailModal(true);
        } else {
          toast({ title: 'No se detectó ningún proveedor conectado. Verifica la integración en tu CRM.' });
        }
      } catch (e) {
        console.error('Error fetch:', e);
        toast({ title: 'Error al verificar la conexión.' });
      } finally {
        setVerificando(false);
      }
      return;
    }

    if (stepKey === 'redes') {
      setVerificando(true);
      try {
        const res = await fetch(`${BASE_URL}/onboarding-process`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trigger: 'verificar_redes', locationId: loc }),
        });
        const text = await res.text();
        const cleanText = text.trim().replace(/^=/, '');
        console.log('REDES RAW:', cleanText);
        let data: { status: string; pagina?: string; logo?: string };
        try {
          data = JSON.parse(cleanText);
        } catch {
          console.error('Error parseando redes:', text);
          toast({ title: 'Error al procesar la respuesta del servidor.' });
          return;
        }
        if (data.status === 'ok') {
          await sendValidador('si');
          setStep(stepKey, true);
          setRedesData({ pagina: data.pagina ?? '', logo: data.logo ?? '' });
          setShowRedesModal(true);
        } else {
          toast({ title: 'No se detectaron redes conectadas. Verifica la integración en tu CRM.' });
        }
      } catch (e) {
        console.error('Error fetch redes:', e);
        toast({ title: 'Error al verificar la conexión.' });
      } finally {
        setVerificando(false);
      }
      return;
    }

    await sendValidador('si');
    setStep(stepKey, true);
    toast({ kind: 'ok', title: 'Paso marcado como completado' });
    setTimeout(() => navigate(`/${locationId ?? 'loc_HRZ2042'}`), 900);
  };

  const navigateDominio = () => {
    setShowGmailModal(false);
    navigate(`/${locationId ?? 'loc_HRZ2042'}/dominio`);
  };

  const navigateWhatsapp = () => {
    setShowRedesModal(false);
    navigate(`/${locationId ?? 'loc_HRZ2042'}/whatsapp`);
  };

  return {
    status,
    markDone,
    markUndone,
    verificando,
    showGmailModal,
    setShowGmailModal,
    proveedor,
    showRedesModal,
    setShowRedesModal,
    redesData,
    navigateDominio,
    navigateWhatsapp,
  };
}
