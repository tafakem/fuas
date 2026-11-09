import React, { useState, useEffect } from 'react';
import { 
  Building2, Package, Layers, Truck, FileText, Users, Shield, 
  BarChart3, CheckCircle2, AlertTriangle, Plus, Search, Edit2, 
  Download, Upload, LogOut, Lock, User, FileSpreadsheet, Printer, 
  Eye, Check, X, RefreshCw, AlertCircle, ShoppingCart, Trash2,
  Filter, Calendar, QrCode, Key, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Camera
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
function SearchableEstablishmentSelect({
  establishments,
  value,
  onChange,
  placeholder = "Buscar IPRESS por RENAES o Nombre...",
  required = false,
  includeAllOption = false,
  allLabel = "-- Todos los Establecimientos --"
}: {
  establishments: any[];
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  includeAllOption?: boolean;
  allLabel?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedEst = establishments.find(e => String(e.id) === String(value));
  const isAllSelected = includeAllOption && (value === 'todos' || value === '' || !value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = establishments.filter(e => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    const renaes = (e.renaes || '').toLowerCase();
    const nombre = (e.nombre || '').toLowerCase();
    return renaes.includes(q) || nombre.includes(q);
  });

  return (
    <div ref={containerRef} className="relative w-full">
      {selectedEst && !isOpen && !isAllSelected ? (
        <div className="w-full bg-blue-50/90 border border-blue-300 rounded-xl px-3 py-2 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="px-2 py-0.5 bg-blue-600 text-white font-mono font-bold text-[10px] rounded-md shrink-0">
              {selectedEst.renaes || 'RENAES'}
            </span>
            <span className="font-bold text-blue-950 truncate">{selectedEst.nombre}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange('');
              setSearch('');
              setIsOpen(true);
            }}
            className="p-1 text-slate-400 hover:text-red-600 rounded-lg transition-colors ml-2 shrink-0"
            title="Cambiar IPRESS"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            required={required && !value && !includeAllOption}
            placeholder={
              selectedEst 
                ? `${selectedEst.renaes} - ${selectedEst.nombre}` 
                : isAllSelected && includeAllOption 
                  ? allLabel 
                  : placeholder
            }
            value={search}
            onFocus={() => setIsOpen(true)}
            onChange={e => {
              setSearch(e.target.value);
              setIsOpen(true);
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium placeholder:text-slate-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto divide-y divide-slate-100">
          <div className="p-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span>{filtered.length} IPRESS encontrada(s)</span>
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-blue-600 hover:underline"
              >
                Limpiar
              </button>
            )}
          </div>

          {includeAllOption && (
            <button
              type="button"
              onClick={() => {
                onChange('todos');
                setIsOpen(false);
                setSearch('');
              }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-blue-50 transition-colors ${
                value === 'todos' || !value ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-700'
              }`}
            >
              {allLabel}
            </button>
          )}

          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 italic">
              No se encontró ninguna IPRESS con "{search}"
            </div>
          ) : (
            filtered.map(e => {
              const isSelected = String(e.id) === String(value);
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => {
                    onChange(String(e.id));
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                    isSelected ? 'bg-blue-50 font-bold text-blue-900' : 'text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 font-mono font-bold text-[10px] rounded shrink-0">
                      {e.renaes || 'RENAES'}
                    </span>
                    <span className="truncate">{e.nombre}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function SearchableProgrammingSelect({
  programming,
  value,
  onChange
}: {
  programming: any[];
  value: string | number;
  onChange: (prog: any) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterPendingOnly, setFilterPendingOnly] = useState(true);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedProg = programming.find(p => String(p.id) === String(value));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = programming.filter(p => {
    const isPending = p.cantidad_recibida < p.cantidad;
    if (filterPendingOnly && !isPending) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    const idStr = String(p.id);
    const renaes = (p.renaes || '').toLowerCase();
    const estName = (p.establishment_nombre || '').toLowerCase();
    const batchCode = (p.batch_codigo || '').toLowerCase();
    const rangeStr = `${p.range_start}-${p.range_end}`;
    return idStr.includes(q) || renaes.includes(q) || estName.includes(q) || batchCode.includes(q) || rangeStr.includes(q);
  });

  return (
    <div ref={containerRef} className="relative w-full">
      {selectedProg && !isOpen ? (
        <div className="w-full bg-blue-50/90 border border-blue-300 rounded-xl p-3 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="px-2 py-0.5 bg-blue-600 text-white font-mono font-bold text-[10px] rounded-md shrink-0">
              Prog #{selectedProg.id}
            </span>
            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 font-mono text-[10px] font-bold rounded shrink-0">
              Lote {selectedProg.batch_codigo}
            </span>
            <div className="truncate">
              <span className="font-bold text-blue-950 block truncate">{selectedProg.establishment_nombre} ({selectedProg.renaes})</span>
              <span className="text-[11px] text-slate-600 block font-mono">
                Rango: {selectedProg.range_start}-{selectedProg.range_end} | Pendiente: {(selectedProg.cantidad - selectedProg.cantidad_recibida).toLocaleString()} de {selectedProg.cantidad.toLocaleString()}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setSearch('');
              setIsOpen(true);
            }}
            className="p-1 text-slate-400 hover:text-red-600 rounded-lg transition-colors ml-2 shrink-0"
            title="Cambiar programación seleccionada"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder={selectedProg ? `Prog #${selectedProg.id} - ${selectedProg.establishment_nombre}` : "Buscar por IPRESS, RENAES, Lote o Rango..."}
            value={search}
            onFocus={() => setIsOpen(true)}
            onChange={e => {
              setSearch(e.target.value);
              setIsOpen(true);
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium placeholder:text-slate-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-72 overflow-y-auto divide-y divide-slate-100">
          <div className="p-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
            <span>{filtered.length} programación(es) FUA encontrada(s)</span>
            <button
              type="button"
              onClick={() => setFilterPendingOnly(!filterPendingOnly)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                filterPendingOnly ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {filterPendingOnly ? 'Filtro: Solo Pendientes' : 'Filtro: Ver Todas'}
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 italic">
              No se encontraron programaciones FUA coincidentes.
            </div>
          ) : (
            filtered.map(p => {
              const isSelected = String(p.id) === String(value);
              const pendingQty = p.cantidad - p.cantidad_recibida;
              const isComplete = pendingQty <= 0;
              const pct = Math.round((p.cantidad_recibida / p.cantidad) * 100);

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onChange(p);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-3 py-2.5 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                    isSelected ? 'bg-blue-50 font-bold text-blue-900' : 'text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 font-mono font-bold text-[10px] rounded shrink-0">
                      Prog #{p.id}
                    </span>
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] rounded shrink-0 border">
                      Lote {p.batch_codigo}
                    </span>
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate">{p.establishment_nombre} ({p.renaes})</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Rango: {p.range_start}-{p.range_end} | Prog: {p.cantidad.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isComplete ? 'Completo 100%' : `Pendiente ${pendingQty.toLocaleString()}`}
                    </span>
                    <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1 ml-auto">
                      <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(pct, 100)}%` }}></div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function PaginationControls({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange
}: {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 text-xs">
      <div className="flex flex-wrap items-center gap-2 text-slate-600">
        <span>Mostrando <strong className="text-slate-900 font-bold">{startItem}</strong> a <strong className="text-slate-900 font-bold">{endItem}</strong> de <strong className="text-slate-900 font-bold">{totalItems}</strong> registros</span>
        <span className="text-slate-300 hidden sm:inline">|</span>
        <label className="flex items-center gap-1.5">
          <span>Mostrar:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value={10}>10 por pág.</option>
            <option value={25}>25 por pág.</option>
            <option value={50}>50 por pág.</option>
            <option value={100}>100 por pág.</option>
          </select>
        </label>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(1)}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent font-medium transition-colors"
          title="Primera página"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent font-semibold flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>
        
        <span className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg font-bold text-xs shadow-sm">
          Pág. {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent font-semibold flex items-center gap-1 transition-colors"
        >
          Siguiente <ChevronRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(totalPages)}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent font-medium transition-colors"
          title="Última página"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('diresa_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Data states
  const [stats, setStats] = useState<any>({});
  const [establishments, setEstablishments] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [programming, setProgramming] = useState<any[]>([]);
  const [receptions, setReceptions] = useState<any[]>([]);
  const [inventoryStock, setInventoryStock] = useState<any[]>([]);
  const [inventoryMovements, setInventoryMovements] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [warehousePackages, setWarehousePackages] = useState<any[]>([]);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [packageModalMode, setPackageModalMode] = useState<'create' | 'view'>('create');
  const [packageForm, setPackageForm] = useState<any>({
    product_id: '',
    establishment_id: '',
    cantidad_inicial: 3000,
    batch_id: '',
    range_start: '00001',
    range_end: '03000',
    numero_paquete: '01/01',
    ubicacion_almacen: 'Almacén Central - Sector A',
    foto_etiqueta: '',
    ocr_raw_text: ''
  });
  const [isScanningOCR, setIsScanningOCR] = useState(false);
  const [pkgSearch, setPkgSearch] = useState('');
  const [pkgFilterEst, setPkgFilterEst] = useState('todos');
  const [pkgFilterStatus, setPkgFilterStatus] = useState('todos');

  // Camera & Image Capture States
  const [showCameraScannerModal, setShowCameraScannerModal] = useState(false);
  const [cameraScannerTarget, setCameraScannerTarget] = useState<'ocr' | 'qr'>('ocr');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturingCamera, setIsCapturingCamera] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const openCameraScanner = async (target: 'ocr' | 'qr') => {
    setCameraScannerTarget(target);
    setCameraError(null);
    setShowCameraScannerModal(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('El navegador o la conexión actual no soporta acceso directo a la cámara. Puede usar la opción de subir imagen.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      });
      setCameraStream(stream);
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Permiso de cámara denegado por el usuario o navegador. Puede conceder permisos en la barra de direcciones o usar "Subir Imagen".');
      } else {
        setCameraError('No se pudo inicializar la cámara del dispositivo. Puede cargar una fotografía guardada desde sus archivos.');
      }
    }
  };

  const closeCameraScanner = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraScannerModal(false);
    setCameraError(null);
  };

  useEffect(() => {
    if (showCameraScannerModal && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(console.error);
    }
  }, [showCameraScannerModal, cameraStream]);

  const processOCRWithBase64 = async (base64Img: string) => {
    setIsScanningOCR(true);
    try {
      const res = await fetch('/api/warehouse/packages/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Img })
      });
      const data = await res.json();
      if (res.ok && data.extracted) {
        const ext = data.extracted;
        const matchedEst = establishments.find(
          e => e.renaes && String(e.renaes).padStart(8, '0') === String(ext.renaes).padStart(8, '0')
        );
        setPackageForm((prev: any) => ({
          ...prev,
          establishment_id: matchedEst ? String(matchedEst.id) : prev.establishment_id,
          cantidad_inicial: ext.cantidad || prev.cantidad_inicial,
          range_start: ext.range_start || prev.range_start,
          range_end: ext.range_end || prev.range_end,
          numero_paquete: ext.numero_paquete || prev.numero_paquete,
          ocr_raw_text: ext.ocr_raw_text || '',
          foto_etiqueta: base64Img
        }));
        showToast(`✅ OCR procesado: RENAES ${ext.renaes} (${ext.nombre_ipress}) reconocido.`);
      } else {
        showToast(data.error || 'No se pudo extraer información clara de la imagen', 'error');
      }
    } catch (err) {
      showToast('Error al procesar lectura de la imagen de etiqueta OCR', 'error');
    } finally {
      setIsScanningOCR(false);
    }
  };

  const captureCameraPhoto = async () => {
    if (!videoRef.current) return;
    setIsCapturingCamera(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        closeCameraScanner();
        if (cameraScannerTarget === 'ocr') {
          await processOCRWithBase64(dataUrl);
        } else {
          showToast('✅ QR Capturado desde cámara. Procesando consulta de paquete...');
        }
      }
    } catch (err) {
      showToast('Error al tomar captura con la cámara', 'error');
    } finally {
      setIsCapturingCamera(false);
    }
  };

  const handleFileUploadOCR = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Img = event.target?.result as string;
      if (base64Img) {
        await processOCRWithBase64(base64Img);
      }
    };
    reader.readAsDataURL(file);
  };

  // Modals & UI states
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Programming modal & filters
  const [showProgModal, setShowProgModal] = useState(false);
  const [progForm, setProgForm] = useState<any>({ id: null, establishment_id: '', batch_id: '', cantidad: 1000, supplier_id: '', origen: 'proveedor' });
  const [progSearch, setProgSearch] = useState('');
  const [progEstId, setProgEstId] = useState('todos');
  const [progBatchId, setProgBatchId] = useState('todos');
  const [progOrigen, setProgOrigen] = useState('todos');
  const [progStatus, setProgStatus] = useState('todos');
  const [showProgBulkModal, setShowProgBulkModal] = useState(false);
  const [bulkExcelData, setBulkExcelData] = useState<any[]>([]);
  const [bulkFileName, setBulkFileName] = useState('');
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);

  // New Reception modal & QR state
  const [showRecModal, setShowRecModal] = useState(false);
  const [recType, setRecType] = useState<'fua' | 'demanda'>('fua');
  const [recForm, setRecForm] = useState({ programming_id: '', establishment_id: '', batch_id: '', supplier_id: '', fecha_recepcion: new Date().toISOString().split('T')[0], documento: '', cantidad_recibida: 0, range_start: 0, range_end: 0, tipo_ingreso: 'proveedor', product_id: '' });
  
  // QR Verification / Scanner state
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [qrVerificationResult, setQrVerificationResult] = useState<any>(null);

  // Personnel Modal
  const [showPersModal, setShowPersModal] = useState(false);
  const [persForm, setPersForm] = useState<any>({ id: null, dni: '', nombres: '', apellidos: '' });
  const [isSearchingDNI, setIsSearchingDNI] = useState(false);

  // Delivery / Cart state
  const [cartEstablishment, setCartEstablishment] = useState('');
  const [cartDni, setCartDni] = useState('');
  const [cartReceptorName, setCartReceptorName] = useState('');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartObservaciones, setCartObservaciones] = useState('');
  const [customProdId, setCustomProdId] = useState('');
  const [customBatchId, setCustomBatchId] = useState('');
  const [customQty, setCustomQty] = useState(10);

  // Establishment Modal
  const [showEstModal, setShowEstModal] = useState(false);
  const [estForm, setEstForm] = useState({ id: null, renaes: '', nombre: '', activo: 1 });
  const [selectedEstHistory, setSelectedEstHistory] = useState<any>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Batch Modal
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchForm, setBatchForm] = useState({ id: null, codigo: '', descripcion: '', anio: 2026, activo: 1 });

  // Supplier Modal
  const [showSupModal, setShowSupModal] = useState(false);
  const [supForm, setSupForm] = useState({ id: null, ruc: '', nombre: '', contacto: '', telefono: '', activo: 1 });

  // Product Modal state
  const [showProdModal, setShowProdModal] = useState(false);
  const [prodForm, setProdForm] = useState({ id: null, codigo: '', nombre: '', tipo: 'otro', unidad_control: 'blocks', hojas_por_block: 50, stock_total: 0, stock_disponible: 0, activo: 1 });

  // User Modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({ id: null, username: '', password: '', nombre_completo: '', role: 'user', permissions: { consultar: true, registrar: true, modificar: false, anular: false, importar: false, reportes: true } });

  // API Perú Settings state (Admin Only)
  const [apiPeruTokenInput, setApiPeruTokenInput] = useState('');
  const [apiPeruTestDNI, setApiPeruTestDNI] = useState('44444444');
  const [isSavingToken, setIsSavingToken] = useState(false);
  const [isTestingToken, setIsTestingToken] = useState(false);
  const [apiPeruTestResult, setApiPeruTestResult] = useState<any>(null);

  // Comprobantes & Reportes filter states
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [reportEstId, setReportEstId] = useState('todos');
  const [reportSearchQuery, setReportSearchQuery] = useState('');

  // Module Pagination States
  const [estPage, setEstPage] = useState(1);
  const [estPageSize, setEstPageSize] = useState(25);

  const [progPage, setProgPage] = useState(1);
  const [progPageSize, setProgPageSize] = useState(25);

  const [recPage, setRecPage] = useState(1);
  const [recPageSize, setRecPageSize] = useState(25);

  const [persPage, setPersPage] = useState(1);
  const [persPageSize, setPersPageSize] = useState(25);

  const [pkgPage, setPkgPage] = useState(1);
  const [pkgPageSize, setPkgPageSize] = useState(25);

  const [reportPage, setReportPage] = useState(1);
  const [reportPageSize, setReportPageSize] = useState(25);

  // Notifications / Feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load all data
  const loadData = async () => {
    try {
      const [estRes, batRes, supRes, prodRes, progRes, recRes, stockRes, movRes, delRes, persRes, usersRes, auditRes, statsRes, pkgRes, apiPeruRes] = await Promise.all([
        fetch('/api/establishments').then(r => r.json()),
        fetch('/api/batches').then(r => r.json()),
        fetch('/api/suppliers').then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
        fetch('/api/programming').then(r => r.json()),
        fetch('/api/receptions').then(r => r.json()),
        fetch('/api/inventory/stock').then(r => r.json()),
        fetch('/api/inventory/movements').then(r => r.json()),
        fetch('/api/deliveries').then(r => r.json()),
        fetch('/api/personnel').then(r => r.json()),
        fetch('/api/users').then(r => r.json()),
        fetch('/api/audit-logs').then(r => r.json()),
        fetch('/api/dashboard/stats').then(r => r.json()),
        fetch('/api/warehouse/packages').then(r => r.json()),
        fetch('/api/settings/apiperu').then(r => r.json()).catch(() => ({ token: '' }))
      ]);

      setEstablishments(estRes);
      setBatches(batRes);
      setSuppliers(supRes);
      setProducts(prodRes);
      setProgramming(progRes);
      setReceptions(recRes);
      setInventoryStock(stockRes);
      setInventoryMovements(movRes);
      setDeliveries(delRes);
      setPersonnel(persRes);
      setUsersList(usersRes);
      setAuditLogs(auditRes);
      setStats(statsRes);
      setWarehousePackages(pkgRes);
      if (apiPeruRes && apiPeruRes.token) {
        setApiPeruTokenInput(apiPeruRes.token);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('diresa_user', JSON.stringify(data.user));
        showToast('Sesión iniciada correctamente');
      } else {
        setLoginError(data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setLoginError('Error de conexión con el servidor');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('diresa_user');
    showToast('Sesión cerrada');
  };

  // DNI Lookup for Reception Personnel
  const handleDniLookup = async (dni: string) => {
    setCartDni(dni);
    if (dni.length === 8) {
      try {
        const res = await fetch(`/api/personnel/dni/${dni}`);
        const data = await res.json();
        if (data.found) {
          setCartReceptorName(`${data.person.nombres} ${data.person.apellidos}`);
          if (data.person.establishment_id) {
            setCartEstablishment(String(data.person.establishment_id));
          }
          showToast('Personal receptor encontrado');
        } else {
          showToast('DNI no registrado. Ingrese nombres y apellidos manualmente.', 'error');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Generate PDF Comprobante / Acta de Entrega - Recepción
  const generatePDF = (delivery: any) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    
    // --- 1. HEADER INSTITUCIONAL ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text('GOBIERNO REGIONAL PIURA', pageWidth / 2, 14, { align: 'center' });
    doc.text('DIRECCIÓN REGIONAL DE SALUD PIURA', pageWidth / 2, 19, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 58, 138); // blue-900
    doc.text('SUB REGIÓN DE SALUD LUCIANO CASTILLO COLONNA', pageWidth / 2, 24, { align: 'center' });
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text('DIRECCIÓN DE ASEGURAMIENTO EN SALUD — CONTROL Y DISTRIBUCIÓN DE FORMATOS', pageWidth / 2, 29, { align: 'center' });

    // Header Lines
    doc.setLineWidth(0.8);
    doc.setDrawColor(30, 58, 138); // blue border
    doc.line(14, 32, pageWidth - 14, 32);
    doc.setLineWidth(0.2);
    doc.line(14, 33.5, pageWidth - 14, 33.5);

    // --- 2. TÍTULO DEL DOCUMENTO ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('ACTA DE ENTREGA - RECEPCIÓN DE FORMATOS DE SALUD', pageWidth / 2, 41, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(30, 58, 138);
    doc.text(`N° COMPROBANTE: ${delivery.numero_comprobante || 'N/A'}`, pageWidth / 2, 47, { align: 'center' });

    // --- 3. METADATOS Y DATOS GENERALES (Cuadro informativo) ---
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setFillColor(248, 250, 252); // slate-50
    doc.roundedRect(14, 52, pageWidth - 28, 36, 2, 2, 'FD');

    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    // Columna 1
    doc.setFont('helvetica', 'bold');
    doc.text('Fecha / Hora de Emisión:', 18, 58);
    doc.setFont('helvetica', 'normal');
    doc.text(`${delivery.fecha_entrega || new Date().toISOString().substring(0, 10)}`, 55, 58);

    doc.setFont('helvetica', 'bold');
    doc.text('Establecimiento (IPRESS):', 18, 64);
    doc.setFont('helvetica', 'normal');
    doc.text(`${delivery.establishment_nombre || 'N/A'}`, 55, 64);

    doc.setFont('helvetica', 'bold');
    doc.text('Código RENAES:', 18, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(`${delivery.renaes || 'N/A'}`, 55, 70);

    // Columna 2
    doc.setFont('helvetica', 'bold');
    doc.text('Personal Receptor:', 110, 58);
    doc.setFont('helvetica', 'normal');
    doc.text(`${delivery.receptor_nombre || 'N/A'}`, 142, 58);

    doc.setFont('helvetica', 'bold');
    doc.text('DNI Receptor:', 110, 64);
    doc.setFont('helvetica', 'normal');
    doc.text(`${delivery.receptor_dni || 'N/A'}`, 142, 64);

    doc.setFont('helvetica', 'bold');
    doc.text('Emisor / Resp. Almacén:', 110, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(`${delivery.username || 'Sistema'}`, 142, 70);

    doc.setFont('helvetica', 'bold');
    doc.text('Origen / Sub Región:', 18, 76);
    doc.setFont('helvetica', 'normal');
    doc.text('Almacén Central DIRESA LCC - Sullana', 55, 76);

    doc.setFont('helvetica', 'bold');
    doc.text('Estado Comprobante:', 110, 76);
    doc.setFont('helvetica', 'normal');
    doc.text('ENTREGADO / CONFORMIDAD PENDIENTE DE FIRMA', 142, 76);

    // --- 4. TABLA DE FORMATOS Y PRODUCTOS ENTREGADOS ---
    const tableData = (delivery.items || []).map((item: any, index: number) => {
      let detalleRango = 'Formatos Bajo Demanda / Blocks';
      if (item.range_start && item.range_end) {
        detalleRango = `Del ${String(item.range_start).padStart(8, '0')} al ${String(item.range_end).padStart(8, '0')}`;
      } else if (item.range_start) {
        detalleRango = `Inicio: ${item.range_start}`;
      }

      return [
        index + 1,
        item.product_codigo || 'FORMATO',
        item.product_nombre || 'Formato Único de Atención - FUA',
        item.batch_codigo ? `Lote ${item.batch_codigo}` : 'S/L',
        detalleRango,
        item.cantidad || 0
      ];
    });

    autoTable(doc, {
      startY: 93,
      head: [['N°', 'Código', 'Descripción del Formato / Insumo', 'Lote', 'Detalle / Rango Correlativo (FUA)', 'Cantidad']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [30, 58, 138], 
        textColor: 255, 
        fontSize: 8.5, 
        fontStyle: 'bold', 
        halign: 'center' 
      },
      bodyStyles: { 
        fontSize: 8, 
        textColor: [30, 41, 59] 
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'center', cellWidth: 22 },
        2: { cellWidth: 65 },
        3: { halign: 'center', cellWidth: 20 },
        4: { halign: 'center', cellWidth: 48 },
        5: { halign: 'center', cellWidth: 18 }
      },
      margin: { left: 14, right: 14 }
    });

    let currentY = ((doc as any).lastAutoTable?.finalY || 150) + 8;

    // Control de espacio para pie de página / firmas
    if (currentY > 230) {
      doc.addPage();
      currentY = 25;
    }

    // --- 5. OBSERVACIONES Y DECLARACIÓN DE CONFORMIDAD ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('OBSERVACIONES / NOTAS:', 14, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const obsText = delivery.observaciones 
      ? delivery.observaciones 
      : 'Se realiza la entrega formal de los formatos indicados en la presente acta para el cumplimiento de actividades institucionales en la IPRESS receptora.';
    
    doc.text(obsText, 14, currentY + 5, { maxWidth: pageWidth - 28 });

    currentY += 14;

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text(
      'DECLARACIÓN: El receptor declara haber verificado la cantidad, lote y correlativos descritos, dando conformidad de recepción.',
      14, 
      currentY, 
      { maxWidth: pageWidth - 28 }
    );

    currentY += 22;

    // --- 6. BLOQUES DE FIRMAS Y SELLOS ---
    const lineWidth = 65;
    const leftMarginSig1 = 20;
    const leftMarginSig2 = pageWidth - 20 - lineWidth;

    doc.setLineWidth(0.4);
    doc.setDrawColor(71, 85, 105);
    
    // Líneas de firma
    doc.line(leftMarginSig1, currentY, leftMarginSig1 + lineWidth, currentY);
    doc.line(leftMarginSig2, currentY, leftMarginSig2 + lineWidth, currentY);

    // Textos firma 1 (Receptor)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('FIRMA Y SELLO - PERSONAL RECEPTOR', leftMarginSig1 + lineWidth / 2, currentY + 4, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(`Nombre: ${delivery.receptor_nombre || '................................................'}`, leftMarginSig1 + lineWidth / 2, currentY + 8.5, { align: 'center' });
    doc.text(`DNI: ${delivery.receptor_dni || '........................'}`, leftMarginSig1 + lineWidth / 2, currentY + 12.5, { align: 'center' });
    doc.text(`IPRESS: ${delivery.establishment_nombre || '................................................'}`, leftMarginSig1 + lineWidth / 2, currentY + 16.5, { align: 'center' });

    // Textos firma 2 (Emisor / Almacén)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('FIRMA Y SELLO - RESPONSABLE DE ALMACÉN', leftMarginSig2 + lineWidth / 2, currentY + 4, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(`Usuario Emisor: ${delivery.username || 'Almacén Central'}`, leftMarginSig2 + lineWidth / 2, currentY + 8.5, { align: 'center' });
    doc.text('DIRESA Luciano Castillo Colonna', leftMarginSig2 + lineWidth / 2, currentY + 12.5, { align: 'center' });
    doc.text('Sullana - Piura', leftMarginSig2 + lineWidth / 2, currentY + 16.5, { align: 'center' });

    // Pie de página oficial
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`Sistema de Control de Formatos — DIRESA LCC Sullana | Generado el ${new Date().toLocaleString()}`, pageWidth / 2, 287, { align: 'center' });

    // Guardar archivo PDF
    doc.save(`Acta_Entrega_${delivery.numero_comprobante || 'Formatos'}.pdf`);
  };

  // Export Excel Report
  const exportToExcel = (data: any[], filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    showToast('Reporte exportado a Excel con éxito');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-blue-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-lg mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">DIRESA LCC</h1>
            <p className="text-sm text-slate-600 mt-1">Dirección de Aseguramiento en Salud</p>
            <p className="text-xs text-blue-600 font-medium mt-2">Sistema de Almacén y Distribución de Formatos</p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Usuario</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 text-sm"
                  placeholder="Ingrese su usuario"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            <p>Credenciales de prueba:</p>
            <p className="font-semibold text-slate-700 mt-1">Admin: admin / admin123</p>
            <p className="font-semibold text-slate-700">Operador: operador / user123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-xl shadow-xl text-white font-medium flex items-center gap-3 transition-all duration-300 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner">
              DI
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">DIRESA LUCIANO CASTILLO COLONNA</h1>
              <p className="text-xs text-blue-400">Dirección de Aseguramiento en Salud • 206+ Establecimientos</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">{currentUser.nombre_completo}</p>
              <span className="text-xs px-2 py-0.5 bg-blue-900 text-blue-200 rounded-full font-medium uppercase">
                {currentUser.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-red-600 hover:text-white rounded-xl text-xs font-semibold transition-colors text-slate-300"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <nav className="bg-white border-b border-slate-200 shadow-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 py-2">
          {[
            { id: 'dashboard', label: 'Panel', icon: BarChart3 },
            { id: 'establishments', label: 'Establecimientos', icon: Building2 },
            { id: 'batches', label: 'Lotes', icon: Layers },
            { id: 'catalog', label: 'Catálogo & Proveedores', icon: Package },
            { id: 'programming', label: 'Programación FUA', icon: FileText },
            { id: 'reception', label: 'Recepción Almacén', icon: Truck },
            { id: 'packages', label: 'Paquetes y QR', icon: QrCode },
            { id: 'inventory', label: 'Inventario & Stock', icon: BarChart3 },
            { id: 'cart', label: 'Carrito de Entregas', icon: ShoppingCart },
            { id: 'personnel', label: 'Personal Receptor', icon: Users },
            { id: 'comprobantes', label: 'Comprobantes & Reportes', icon: FileSpreadsheet },
            ...(currentUser.role === 'admin' ? [{ id: 'users', label: 'Usuarios & Auditoría', icon: Shield }] : [])
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* --- 1. DASHBOARD --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Establecimientos</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.totalEstablishments || 0}</p>
                <span className="text-xs text-emerald-600 font-medium mt-2 inline-block">Red activa (206+)</span>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">FUA Programados</p>
                <p className="text-3xl font-extrabold text-blue-600 mt-2">{stats.totalProgrammed || 0}</p>
                <span className="text-xs text-slate-500 mt-2 inline-block">Correlativos asignados</span>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pendiente Recepción</p>
                <p className="text-3xl font-extrabold text-amber-600 mt-2">{stats.pendingReception || 0}</p>
                <span className="text-xs text-amber-600 font-medium mt-2 inline-block">Por ingresar de proveedor</span>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">FUA Recibidos</p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-2">{stats.totalReceived || 0}</p>
                <span className="text-xs text-emerald-600 font-medium mt-2 inline-block">Ingreso físico confirmado</span>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Formatos Entregados</p>
                <p className="text-3xl font-extrabold text-indigo-600 mt-2">{stats.totalDelivered || 0}</p>
                <span className="text-xs text-indigo-600 font-medium mt-2 inline-block">FUA y otros formatos</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-base font-bold text-slate-900 mb-4">Últimos Movimientos de Almacén</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase">
                        <th className="pb-3">Fecha</th>
                        <th className="pb-3">Establecimiento</th>
                        <th className="pb-3">Producto</th>
                        <th className="pb-3">Tipo</th>
                        <th className="pb-3">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inventoryMovements.slice(0, 6).map((m: any) => (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="py-2.5 text-slate-600">{m.created_at?.substring(0, 10)}</td>
                          <td className="py-2.5 font-medium text-slate-800">{m.establishment_nombre}</td>
                          <td className="py-2.5 text-slate-600">{m.product_nombre}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                              m.tipo === 'recepcion' ? 'bg-emerald-100 text-emerald-800' :
                              m.tipo === 'entrega' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {m.tipo}
                            </span>
                          </td>
                          <td className="py-2.5 font-bold text-slate-900">{m.cantidad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-base font-bold text-slate-900 mb-4">Accesos Rápidos del Sistema</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => setActiveTab('packages')} className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 text-left transition-colors col-span-2 shadow-sm">
                    <QrCode className="w-6 h-6 text-purple-600 mb-2" />
                    <p className="font-bold text-sm text-purple-950">📦 Módulo de Paquetes, OCR de Etiquetas y QR</p>
                    <p className="text-xs text-purple-800 mt-1">Escanear etiquetas de proveedores, generar códigos QR únicos e identificar paquetes por RENAES</p>
                  </button>
                  <button onClick={() => setActiveTab('programming')} className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 text-left transition-colors">
                    <FileText className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="font-bold text-sm text-slate-900">Programación FUA</p>
                    <p className="text-xs text-slate-600 mt-1">Generar nuevos rangos de correlativos</p>
                  </button>
                  <button onClick={() => setActiveTab('reception')} className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 text-left transition-colors">
                    <Truck className="w-6 h-6 text-emerald-600 mb-2" />
                    <p className="font-bold text-sm text-slate-900">Recepción Física</p>
                    <p className="text-xs text-slate-600 mt-1">FUAs y otros formatos (HIS, etc.)</p>
                  </button>
                  <button onClick={() => setActiveTab('cart')} className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 text-left transition-colors">
                    <ShoppingCart className="w-6 h-6 text-indigo-600 mb-2" />
                    <p className="font-bold text-sm text-slate-900">Carrito Multiproducto</p>
                    <p className="text-xs text-slate-600 mt-1">Entrega de formatos a IPRESS</p>
                  </button>
                  <button onClick={() => setActiveTab('personnel')} className="p-4 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 text-left transition-colors">
                    <Users className="w-6 h-6 text-amber-600 mb-2" />
                    <p className="font-bold text-sm text-slate-900">Personal Receptor</p>
                    <p className="text-xs text-slate-600 mt-1">DNI, Nombres y Apellidos</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 2. ESTABLECIMIENTOS DE SALUD --- */}
        {activeTab === 'establishments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Establecimientos de Salud (206+)</h2>
                <p className="text-xs text-slate-500 mt-1">Gestión de IPRESS con códigos RENAES únicos (conservando ceros iniciales).</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const ws = XLSX.utils.json_to_sheet([{ renaes: '00001', nombre: 'C.S. EJEMPLO' }]);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
                    XLSX.writeFile(wb, 'plantilla_establecimientos.xlsx');
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  <Download className="w-4 h-4" /> Plantilla Excel
                </button>
                <label className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-md shadow-emerald-600/20">
                  <Upload className="w-4 h-4" /> Importar Excel
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const data = await file.arrayBuffer();
                      const workbook = XLSX.read(data);
                      const sheet = workbook.Sheets[workbook.SheetNames[0]];
                      const rows: any[] = XLSX.utils.sheet_to_json(sheet);
                      
                      const formattedRows = rows.map(r => ({
                        renaes: String(r.renaes || r.RENAES || r.codigo || '').trim().padStart(5, '0'),
                        nombre: String(r.nombre || r.NOMBRE || r.establecimiento || '').trim()
                      }));

                      const res = await fetch('/api/establishments/import', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items: formattedRows, username: currentUser.username })
                      });
                      const result = await res.json();
                      if (res.ok) {
                        showToast(`Importación exitosa: ${result.added} nuevos, ${result.updated} actualizados`);
                        loadData();
                      } else {
                        showToast(result.error || 'Error al importar', 'error');
                      }
                    }}
                  />
                </label>
                <button
                  onClick={() => { setEstForm({ id: null, renaes: '', nombre: '', activo: 1 }); setShowEstModal(true); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" /> Nuevo Establecimiento
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar por código RENAES o nombre de establecimiento..."
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setEstPage(1); }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {(() => {
                const filteredEsts = establishments.filter(e => 
                  (e.renaes || '').includes(searchTerm) || 
                  (e.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
                );
                const paginatedEsts = filteredEsts.slice((estPage - 1) * estPageSize, estPage * estPageSize);

                return (
                  <>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                            <th className="py-3.5 px-4">Código RENAES</th>
                            <th className="py-3.5 px-4">Nombre del Establecimiento (IPRESS)</th>
                            <th className="py-3.5 px-4">Estado</th>
                            <th className="py-3.5 px-4 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedEsts.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="py-8 text-center text-slate-500 italic">
                                No se encontraron establecimientos con el filtro "{searchTerm}"
                              </td>
                            </tr>
                          ) : (
                            paginatedEsts.map((est: any, idx: number) => (
                              <tr key={est.id} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/80'}>
                                <td className="py-3 px-4 font-mono font-bold text-blue-600">{est.renaes}</td>
                                <td className="py-3 px-4 font-bold text-slate-800">{est.nombre}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${est.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                    {est.activo ? 'Activo' : 'Desactivado'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={async () => {
                                        const res = await fetch(`/api/establishments/${est.id}/history`);
                                        const data = await res.json();
                                        if (res.ok) {
                                          setSelectedEstHistory(data);
                                          setShowHistoryModal(true);
                                        } else {
                                          showToast('Error al cargar historial', 'error');
                                        }
                                      }}
                                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                                      title="Ver historial y trazabilidad"
                                    >
                                      <Eye className="w-3.5 h-3.5" /> Historial
                                    </button>
                                    <button
                                      onClick={() => { setEstForm(est); setShowEstModal(true); }}
                                      className="p-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-slate-600 transition-colors"
                                      title="Editar"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={async () => {
                                        if (confirm(`¿Eliminar el establecimiento ${est.nombre}?`)) {
                                          const res = await fetch(`/api/establishments/${est.id}?username=${currentUser.username}`, { method: 'DELETE' });
                                          if (res.ok) {
                                            showToast('Establecimiento eliminado');
                                            loadData();
                                          } else {
                                            showToast('Error al eliminar', 'error');
                                          }
                                        }
                                      }}
                                      className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-colors"
                                      title="Eliminar"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <PaginationControls
                      currentPage={estPage}
                      totalItems={filteredEsts.length}
                      pageSize={estPageSize}
                      onPageChange={setEstPage}
                      onPageSizeChange={setEstPageSize}
                    />
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* --- 3. LOTES --- */}
        {activeTab === 'batches' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Lotes de Formatos</h2>
                <p className="text-xs text-slate-500 mt-1">Gestión de lotes numéricos o alfanuméricos (ej. “27”, “28”, “26A”, “27A”).</p>
              </div>
              <button
                onClick={() => { setBatchForm({ id: null, codigo: '', descripcion: '', anio: 2026, activo: 1 }); setShowBatchModal(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" /> Nuevo Lote
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {batches.map((b: any) => (
                  <div key={b.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-extrabold text-blue-600 font-mono bg-blue-100 px-3 py-1 rounded-xl">Lote {b.codigo}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${b.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {b.activo ? 'Habilitado' : 'Deshabilitado'}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{b.descripcion}</p>
                      <p className="text-xs text-slate-500 mt-1">Año de referencia: {b.anio}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end gap-2">
                      <button
                        onClick={() => { setBatchForm(b); setShowBatchModal(true); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-600 hover:text-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Editar
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`¿Eliminar el lote ${b.codigo}?`)) {
                            const res = await fetch(`/api/batches/${b.id}?username=${currentUser.username}`, { method: 'DELETE' });
                            if (res.ok) {
                              showToast('Lote eliminado');
                              loadData();
                            } else {
                              showToast('Error al eliminar', 'error');
                            }
                          }
                        }}
                        className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- 4. CATÁLOGO & PROVEEDORES --- */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Catálogo de Formatos (FUA y Bajo Demanda)</h3>
                    <p className="text-xs text-slate-500">Registro de cantidades totales y stock disponible descontado por entregas.</p>
                  </div>
                  <button
                    onClick={() => { setProdForm({ id: null, codigo: '', nombre: '', tipo: 'otro', unidad_control: 'blocks', hojas_por_block: 50, stock_total: 0, stock_disponible: 0, activo: 1 }); setShowProdModal(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Nuevo Formato
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase">
                        <th className="pb-3">Código</th>
                        <th className="pb-3">Nombre</th>
                        <th className="pb-3">Tipo Control</th>
                        <th className="pb-3">Stock Total / Disponible</th>
                        <th className="pb-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((p: any) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-2.5 font-mono font-bold text-blue-600">{p.codigo}</td>
                          <td className="py-2.5 font-medium text-slate-800">{p.nombre}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.tipo === 'fua' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'}`}>
                              {p.tipo === 'fua' ? 'FUA (Correlativo)' : 'Bajo Demanda (Stock)'}
                            </span>
                          </td>
                          <td className="py-2.5 font-mono font-bold text-slate-900">
                            {p.tipo === 'fua' ? 'Por Rangos RENAES' : `${p.stock_disponible} / ${p.stock_total} ${p.unidad_control}`}
                          </td>
                          <td className="py-2.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => { setProdForm(p); setShowProdModal(true); }}
                                className="p-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded text-slate-600"
                                title="Editar"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`¿Eliminar el formato ${p.nombre}?`)) {
                                    const res = await fetch(`/api/products/${p.id}?username=${currentUser.username}`, { method: 'DELETE' });
                                    if (res.ok) {
                                      showToast('Formato eliminado');
                                      loadData();
                                    } else {
                                      showToast('Error al eliminar', 'error');
                                    }
                                  }
                                }}
                                className="p-1 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-slate-900">Proveedores Registrados</h3>
                  <button
                    onClick={() => { setSupForm({ id: null, ruc: '', nombre: '', contacto: '', telefono: '', activo: 1 }); setShowSupModal(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Nuevo Proveedor
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase">
                        <th className="pb-3">RUC</th>
                        <th className="pb-3">Razón Social</th>
                        <th className="pb-3">Contacto</th>
                        <th className="pb-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {suppliers.map((s: any) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-2.5 font-mono font-bold text-slate-700">{s.ruc}</td>
                          <td className="py-2.5 font-medium text-slate-800">{s.nombre}</td>
                          <td className="py-2.5 text-slate-600">{s.contacto} ({s.telefono})</td>
                          <td className="py-2.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => { setSupForm(s); setShowSupModal(true); }}
                                className="p-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded text-slate-600"
                                title="Editar"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`¿Eliminar al proveedor ${s.nombre}?`)) {
                                    const res = await fetch(`/api/suppliers/${s.id}?username=${currentUser.username}`, { method: 'DELETE' });
                                    if (res.ok) {
                                      showToast('Proveedor eliminado');
                                      loadData();
                                    } else {
                                      showToast('Error al eliminar', 'error');
                                    }
                                  }
                                }}
                                className="p-1 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 5. PROGRAMACIÓN FUA Y CORRELATIVOS --- */}
        {activeTab === 'programming' && (() => {
          const filteredProgramming = programming.filter((p: any) => {
            // Est filter
            if (progEstId && progEstId !== 'todos' && String(p.establishment_id) !== String(progEstId)) {
              return false;
            }
            // Batch filter
            if (progBatchId && progBatchId !== 'todos' && String(p.batch_id) !== String(progBatchId)) {
              return false;
            }
            // Origen filter
            if (progOrigen && progOrigen !== 'todos' && p.origen !== progOrigen) {
              return false;
            }
            // Status filter
            if (progStatus === 'completo' && p.cantidad_recibida < p.cantidad) return false;
            if (progStatus === 'pendiente' && p.cantidad_recibida >= p.cantidad) return false;
            
            // Search text filter
            if (progSearch.trim()) {
              const q = progSearch.toLowerCase().trim();
              const idStr = String(p.id);
              const renaes = (p.renaes || '').toLowerCase();
              const estName = (p.establishment_nombre || '').toLowerCase();
              const batchCode = (p.batch_codigo || '').toLowerCase();
              const supName = (p.supplier_nombre || '').toLowerCase();
              const rangeStr = `${p.range_start}-${p.range_end}`;
              if (!idStr.includes(q) && !renaes.includes(q) && !estName.includes(q) && !batchCode.includes(q) && !supName.includes(q) && !rangeStr.includes(q)) {
                return false;
              }
            }
            return true;
          });

          const totalProgQty = filteredProgramming.reduce((sum, p) => sum + (p.cantidad || 0), 0);
          const totalRecQty = filteredProgramming.reduce((sum, p) => sum + (p.cantidad_recibida || 0), 0);
          const overallPct = totalProgQty > 0 ? Math.round((totalRecQty / totalProgQty) * 100) : 0;

          const exportProgrammingToExcel = () => {
            const exportRows = filteredProgramming.map(p => ({
              'N° ID': p.id,
              'RENAES': p.renaes || '-',
              'Establecimiento': p.establishment_nombre,
              'Lote': `Lote ${p.batch_codigo}`,
              'Rango Inicial': p.range_start,
              'Rango Final': p.range_end,
              'Cantidad Programada': p.cantidad,
              'Cantidad Recibida': p.cantidad_recibida,
              'Porcentaje Avance': `${Math.round((p.cantidad_recibida / p.cantidad) * 100)}%`,
              'Origen': p.origen === 'impresion_propia' ? 'Impresión Propia' : 'Proveedor',
              'Proveedor': p.supplier_nombre || '-',
              'Usuario Registrador': p.user_nombre || 'Sistema',
              'Fecha Registro': p.created_at?.substring(0, 10) || '-'
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportRows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Programacion_FUAs");
            XLSX.writeFile(workbook, `Programacion_FUAs_${new Date().toISOString().split('T')[0]}.xlsx`);
            showToast("Programación exportada a Excel exitosamente");
          };

          const generateProgrammingPDF = () => {
            const doc = new jsPDF();
            doc.setFontSize(14);
            doc.setTextColor(30, 41, 59);
            doc.text('DIRESA PIURA - SUB REGIÓN DE SALUD LUCIANO CASTILLO COLONNA', 14, 15);
            doc.setFontSize(11);
            doc.text('REPORTE GENERAL DE PROGRAMACIÓN DE FORMATOS FUA Y CORRELATIVOS', 14, 22);
            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139);
            doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()} | Total Programaciones: ${filteredProgramming.length} | Cant. Total: ${totalProgQty.toLocaleString()}`, 14, 28);

            const tableData = filteredProgramming.map(p => [
              `#${p.id}`,
              `${p.establishment_nombre}\n(${p.renaes})`,
              `Lote ${p.batch_codigo}`,
              `${p.range_start} - ${p.range_end}`,
              p.cantidad,
              `${p.cantidad_recibida} (${Math.round((p.cantidad_recibida / p.cantidad) * 100)}%)`,
              p.origen === 'impresion_propia' ? 'Imp. Propia' : (p.supplier_nombre || 'Proveedor')
            ]);

            autoTable(doc, {
              startY: 34,
              head: [['ID', 'Establecimiento (RENAES)', 'Lote', 'Rango Correlativo', 'Programado', 'Recibido', 'Origen / Proveedor']],
              body: tableData,
              styles: { fontSize: 7.5 },
              headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] }
            });

            doc.save(`Reporte_Programacion_FUAs_${new Date().toISOString().split('T')[0]}.pdf`);
            showToast('Reporte PDF descargado exitosamente');
          };

          return (
            <div className="space-y-6">
              {/* Header con Título y Acciones Principal */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-6 h-6 text-blue-600" /> Programación de FUAs & Correlativos Automáticos
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Numeración correlativa independiente por IPRESS y lote. Gestión CRUD y carga masiva para Administradores.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        setBulkExcelData([]);
                        setBulkFileName('');
                        setShowProgBulkModal(true);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow transition-colors"
                      title="Registro masivo mediante archivo Excel (Solo Administradores)"
                    >
                      <Upload className="w-4 h-4" /> Carga Masiva Excel
                    </button>
                  )}
                  <button
                    onClick={generateProgrammingPDF}
                    disabled={filteredProgramming.length === 0}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow transition-colors"
                  >
                    <Printer className="w-4 h-4 text-blue-400" /> Exportar PDF
                  </button>
                  <button
                    onClick={exportProgrammingToExcel}
                    disabled={filteredProgramming.length === 0}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow transition-colors"
                  >
                    <Download className="w-4 h-4" /> Exportar Excel
                  </button>
                  <button
                    onClick={() => {
                      setProgForm({ id: null, establishment_id: '', batch_id: '', cantidad: 1000, supplier_id: '', origen: 'proveedor' });
                      setShowProgModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-600/20"
                  >
                    <Plus className="w-4 h-4" /> Nueva Programación
                  </button>
                </div>
              </div>

              {/* Panel de Filtros Avanzados */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-blue-600" /> Filtros Avanzados de Programación
                  </h3>
                  {(progSearch || progEstId !== 'todos' || progBatchId !== 'todos' || progOrigen !== 'todos' || progStatus !== 'todos') && (
                    <button
                      onClick={() => {
                        setProgSearch('');
                        setProgEstId('todos');
                        setProgBatchId('todos');
                        setProgOrigen('todos');
                        setProgStatus('todos');
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Limpiar Filtros
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Filtro IPRESS */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Establecimiento (IPRESS)
                    </label>
                    <SearchableEstablishmentSelect
                      establishments={establishments}
                      value={progEstId}
                      onChange={val => setProgEstId(val || 'todos')}
                      includeAllOption
                      allLabel="-- Todas las IPRESS --"
                    />
                  </div>

                  {/* Filtro Lote */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Lote
                    </label>
                    <select
                      value={progBatchId}
                      onChange={e => setProgBatchId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="todos">-- Todos los Lotes --</option>
                      {batches.map(b => (
                        <option key={b.id} value={b.id}>Lote {b.codigo} ({b.anio})</option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro Origen */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Origen / Tipo
                    </label>
                    <select
                      value={progOrigen}
                      onChange={e => setProgOrigen(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="todos">-- Todos los Orígenes --</option>
                      <option value="proveedor">Proveedor Externo</option>
                      <option value="impresion_propia">Impresión Propia</option>
                    </select>
                  </div>

                  {/* Filtro Estado Recepción */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Estado Recepción
                    </label>
                    <select
                      value={progStatus}
                      onChange={e => setProgStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="todos">-- Todos los Estados --</option>
                      <option value="pendiente">Pendiente / Parcial (&lt;100%)</option>
                      <option value="completo">Completo (100%)</option>
                    </select>
                  </div>

                  {/* Búsqueda General */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Búsqueda de Texto
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="ID, RENAES, Lote, Rango..."
                        value={progSearch}
                        onChange={e => setProgSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* KPI Banner Resumen */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">Programaciones Registradas</p>
                    <p className="text-xl font-black text-slate-900">{filteredProgramming.length} <span className="text-xs font-normal text-slate-500">de {programming.length}</span></p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">Total FUAs Programados</p>
                    <p className="text-xl font-black text-slate-900">{totalProgQty.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">FUAs Recibidos en Almacén</p>
                    <p className="text-xl font-black text-slate-900">{totalRecQty.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">Avance General</p>
                    <p className="text-xl font-black text-slate-900">{overallPct}%</p>
                  </div>
                </div>
              </div>

              {/* Tabla de Programación con CRUD */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900">Listado de Programación de Formatos FUA</h3>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    Total {filteredProgramming.length} registro(s)
                  </span>
                </div>

                {filteredProgramming.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                    <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No se encontraron programaciones</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      No existen registros que coincidan con los filtros aplicados.
                    </p>
                  </div>
                ) : (
                  <>
                    {(() => {
                      const paginatedProgramming = filteredProgramming.slice((progPage - 1) * progPageSize, progPage * progPageSize);
                      return (
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                                <th className="py-3.5 px-4">ID</th>
                                <th className="py-3.5 px-4">Establecimiento (RENAES)</th>
                                <th className="py-3.5 px-4">Lote</th>
                                <th className="py-3.5 px-4">Rango Asignado</th>
                                <th className="py-3.5 px-4">Cantidad</th>
                                <th className="py-3.5 px-4">Origen / Proveedor</th>
                                <th className="py-3.5 px-4">Recibido</th>
                                <th className="py-3.5 px-4">Fecha</th>
                                <th className="py-3.5 px-4 text-right">Acciones</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {paginatedProgramming.map((p: any, idx: number) => {
                                const porcentaje = p.cantidad > 0 ? Math.round((p.cantidad_recibida / p.cantidad) * 100) : 0;
                                return (
                                  <tr key={p.id} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/80'}>
                                    <td className="py-3 px-4 font-mono font-bold text-slate-700">#{p.id}</td>
                                    <td className="py-3 px-4 font-bold text-slate-900">
                                      {p.establishment_nombre} 
                                      <span className="ml-1.5 px-1.5 py-0.5 bg-slate-100 text-slate-600 font-mono text-[10px] rounded border border-slate-200">
                                        {p.renaes}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 font-bold text-blue-600">Lote {p.batch_codigo}</td>
                                    <td className="py-3 px-4 font-mono font-bold text-emerald-600">Del {p.range_start} al {p.range_end}</td>
                                    <td className="py-3 px-4 font-bold text-slate-900">{p.cantidad.toLocaleString()}</td>
                                    <td className="py-3 px-4 text-slate-600">
                                      {p.origen === 'impresion_propia' ? (
                                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full font-semibold text-[10px]">
                                          Imp. Propia
                                        </span>
                                      ) : (
                                        <span className="font-medium text-slate-700">
                                          {p.supplier_nombre || 'Proveedor'}
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-slate-700">{p.cantidad_recibida} / {p.cantidad}</span>
                                        <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                                          <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(porcentaje, 100)}%` }}></div>
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-500">{porcentaje}%</span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 text-slate-500">{p.created_at?.substring(0, 10)}</td>
                                    <td className="py-3 px-4 text-right">
                                      <div className="flex items-center justify-end gap-1.5">
                                        <button
                                          onClick={() => {
                                            setProgForm({
                                              id: p.id,
                                              establishment_id: String(p.establishment_id),
                                              batch_id: String(p.batch_id),
                                              cantidad: p.cantidad,
                                              supplier_id: p.supplier_id ? String(p.supplier_id) : '',
                                              origen: p.origen || 'proveedor'
                                            });
                                            setShowProgModal(true);
                                          }}
                                          className="p-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-slate-600 transition-colors"
                                          title="Editar Programación"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={async () => {
                                            if (confirm(`¿Eliminar la programación FUA #${p.id}?`)) {
                                              const res = await fetch(`/api/programming/${p.id}?username=${currentUser.username}`, { method: 'DELETE' });
                                              if (res.ok) {
                                                showToast('Programación eliminada');
                                                loadData();
                                              } else {
                                                showToast('Error al eliminar', 'error');
                                              }
                                            }
                                          }}
                                          className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-colors"
                                          title="Eliminar Programación"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}

                    <PaginationControls
                      currentPage={progPage}
                      totalItems={filteredProgramming.length}
                      pageSize={progPageSize}
                      onPageChange={setProgPage}
                      onPageSizeChange={setProgPageSize}
                    />
                  </>
                )}
              </div>
            </div>
          );
        })()}

        {/* --- 6. RECEPCIÓN EN ALMACÉN (FUAs y Otros Formatos) --- */}
        {activeTab === 'reception' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recepción en Almacén (FUAs y Otros Formatos)</h2>
                <p className="text-xs text-slate-500 mt-1">Ingresos para FUAs por rangos y control por cantidad/blocks para Historias Clínicas, HIS, Recetarios, etc.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowQrModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-purple-600/20"
                >
                  <QrCode className="w-4 h-4" /> Verificar QR / Etiqueta
                </button>
                <button
                  onClick={() => setShowRecModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-emerald-600/20"
                >
                  <Plus className="w-4 h-4" /> Registrar Recepción
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
              {receptions.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                  <Truck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No hay recepciones físicas registradas</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Utilice el botón "Registrar Recepción" para realizar ingresos de FUAs o formatos a demanda.
                  </p>
                </div>
              ) : (
                <>
                  {(() => {
                    const paginatedRecs = receptions.slice((recPage - 1) * recPageSize, recPage * recPageSize);
                    return (
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                              <th className="py-3.5 px-4">Fecha</th>
                              <th className="py-3.5 px-4">Doc / Guía</th>
                              <th className="py-3.5 px-4">Establecimiento (IPRESS)</th>
                              <th className="py-3.5 px-4">Tipo Ingreso</th>
                              <th className="py-3.5 px-4">Detalle / Rango</th>
                              <th className="py-3.5 px-4">Cantidad</th>
                              <th className="py-3.5 px-4">Responsable</th>
                              <th className="py-3.5 px-4 text-right">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {paginatedRecs.map((r: any, idx: number) => (
                              <tr key={r.id} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/80'}>
                                <td className="py-3 px-4 text-slate-600 font-medium">{r.fecha_recepcion}</td>
                                <td className="py-3 px-4 font-mono font-bold text-blue-600">{r.documento}</td>
                                <td className="py-3 px-4 font-bold text-slate-900">{r.establishment_nombre}</td>
                                <td className="py-3 px-4">
                                  <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-full text-[10px] font-bold uppercase border border-slate-200">
                                    {r.tipo_ingreso}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-mono text-emerald-700 font-bold">{r.range_start ? `FUA Del ${r.range_start} al ${r.range_end}` : 'Formato sin correlativo (Stock)'}</td>
                                <td className="py-3 px-4 font-bold text-slate-900">{r.cantidad_recibida}</td>
                                <td className="py-3 px-4 text-slate-500 font-medium">{r.user_nombre || 'Sistema'}</td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    onClick={async () => {
                                      if (confirm(`¿Eliminar la recepción doc. ${r.documento}?`)) {
                                        const res = await fetch(`/api/receptions/${r.id}?username=${currentUser.username}`, { method: 'DELETE' });
                                        if (res.ok) {
                                          showToast('Recepción eliminada');
                                          loadData();
                                        } else {
                                          showToast('Error al eliminar', 'error');
                                        }
                                      }
                                    }}
                                    className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-colors"
                                    title="Eliminar"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}

                  <PaginationControls
                    currentPage={recPage}
                    totalItems={receptions.length}
                    pageSize={recPageSize}
                    onPageChange={setRecPage}
                    onPageSizeChange={setRecPageSize}
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* --- 7. INVENTARIO & STOCK --- */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Inventario y Stock Disponible (FUAs y Otros Formatos)</h2>
                <p className="text-xs text-slate-500 mt-1">Control integral de existencias por IPRESS para todos los formatos de salud.</p>
              </div>
              <button
                onClick={() => exportToExcel(inventoryStock, 'inventario_diresa')}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                <Download className="w-4 h-4" /> Exportar Inventario
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase">
                      <th className="pb-3">Establecimiento (RENAES)</th>
                      <th className="pb-3">Producto / Formato</th>
                      <th className="pb-3">Lote</th>
                      <th className="pb-3">Rangos FUA / Detalle Stock</th>
                      <th className="pb-3">Stock Actual</th>
                      <th className="pb-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inventoryStock.map((inv: any) => (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="py-3 font-medium text-slate-900">{inv.establishment_nombre} ({inv.renaes})</td>
                        <td className="py-3 text-slate-800">{inv.product_nombre}</td>
                        <td className="py-3 font-bold text-blue-600">{inv.batch_codigo ? `Lote ${inv.batch_codigo}` : 'N/A'}</td>
                        <td className="py-3 font-mono text-emerald-600">{inv.range_start ? `Del ${inv.range_start} al ${inv.range_end}` : `Stock General: ${inv.stock_actual}`}</td>
                        <td className="py-3 font-extrabold text-slate-900">{inv.stock_actual}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            inv.estado === 'disponible' ? 'bg-emerald-100 text-emerald-800' :
                            inv.estado === 'entregado' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {inv.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- 8. CARRITO MULTIPRODUCTO DE ENTREGAS --- */}
        {activeTab === 'cart' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Carrito Multiproducto de Entregas a IPRESS</h2>
              <p className="text-xs text-slate-500 mb-6">Seleccione establecimiento, DNI del personal receptor y agregue FUAs, Historias Clínicas, HIS, Recetarios y Hojas de Referencia.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">1. Establecimiento Destino</label>
                  <SearchableEstablishmentSelect
                    establishments={establishments}
                    value={cartEstablishment}
                    onChange={val => setCartEstablishment(val)}
                    placeholder="Escriba RENAES o Nombre de IPRESS..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">2. DNI del Personal Receptor</label>
                  <input
                    type="text"
                    maxLength={8}
                    placeholder="Ingrese DNI (8 dígitos)"
                    value={cartDni}
                    onChange={e => handleDniLookup(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">3. Nombres y Apellidos del Receptor</label>
                  <input
                    type="text"
                    placeholder="Nombres y Apellidos"
                    value={cartReceptorName}
                    onChange={e => setCartReceptorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {cartEstablishment && (
                <div className="border-t border-slate-200 pt-6">
                  {/* Stock en almacén del establecimiento */}
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" /> 1. Formatos FUA Asignados / Recepcionados para esta IPRESS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {inventoryStock
                      .filter(inv => String(inv.establishment_id) === cartEstablishment && inv.estado === 'disponible' && inv.stock_actual > 0)
                      .map((item: any) => {
                        const fullQty = item.range_start ? (item.range_end - item.range_start + 1) : item.stock_actual;
                        return (
                          <div key={item.id} className="p-4 bg-gradient-to-br from-blue-50/80 to-slate-50 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-2">
                              <span className="px-2.5 py-1 bg-blue-600 text-white font-mono text-[11px] font-bold rounded-lg">
                                {item.batch_codigo ? `Lote ${item.batch_codigo}` : 'S/L'}
                              </span>
                              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                {item.stock_actual} disponibles
                              </span>
                            </div>
                            <p className="font-bold text-xs text-slate-900 mb-1">{item.product_nombre}</p>
                            <p className="text-[11px] text-slate-600 font-mono bg-white p-2 rounded-lg border border-slate-200 mb-3">
                              {item.range_start ? `Del ${String(item.range_start).padStart(8, '0')} al ${String(item.range_end).padStart(8, '0')}` : `Stock General: ${item.stock_actual}`}
                            </p>
                            
                            <button
                              type="button"
                              onClick={() => {
                                if (!cartItems.some(ci => ci.product_id === item.product_id && ci.range_start === item.range_start)) {
                                  setCartItems([...cartItems, {
                                    product_id: item.product_id,
                                    product_nombre: item.product_nombre,
                                    batch_id: item.batch_id,
                                    batch_codigo: item.batch_codigo,
                                    max_stock: item.stock_actual,
                                    cantidad: fullQty,
                                    range_start: item.range_start,
                                    range_end: item.range_end
                                  }]);
                                  showToast(`FUA (Lote ${item.batch_codigo || ''}) agregado al carrito`);
                                } else {
                                  showToast('Este lote/rango FUA ya está en el carrito', 'error');
                                }
                              }}
                              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
                            >
                              <Plus className="w-4 h-4" /> Agregar FUA al Carrito ({fullQty})
                            </button>
                          </div>
                        );
                      })}
                    {inventoryStock.filter(inv => String(inv.establishment_id) === cartEstablishment && inv.estado === 'disponible' && inv.stock_actual > 0).length === 0 && (
                      <p className="text-xs text-slate-500 italic col-span-3 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
                        Esta IPRESS no tiene asignación FUA por correlativo pendiente en almacén. Puede agregar formatos directamente desde el catálogo interactivo a continuación.
                      </p>
                    )}
                  </div>

                  {/* Catálogo interactivo de formatos por Botones y Tarjetas (Bajo Demanda: HIS, Recetarios, Historias, etc.) */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                        <Package className="w-4 h-4 text-blue-600" /> 2. Catálogo Interactivo de Formatos (Haga clic en un botón para agregar rápidamente)
                      </h3>
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-semibold text-slate-600">Lote Asignado:</label>
                        <select
                          value={customBatchId}
                          onChange={e => setCustomBatchId(e.target.value)}
                          className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                          <option value="">Sin lote específico</option>
                          {batches.map(b => (
                            <option key={b.id} value={b.id}>Lote {b.codigo}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.filter(p => p.tipo === 'otro').map((p: any) => {
                        const isHis = p.codigo.includes('HIS');
                        const isRec = p.codigo.includes('REC');
                        const isHC = p.codigo.includes('HC');
                        const isRef = p.codigo.includes('REF');
                        const isCert = p.codigo.includes('CERT');

                        const badgeColor = isHis ? 'bg-purple-100 text-purple-800 border-purple-200' :
                                           isRec ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                           isHC ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                           isRef ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                           isCert ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-indigo-100 text-indigo-800 border-indigo-200';

                        const iconColor = isHis ? 'text-purple-600' :
                                          isRec ? 'text-emerald-600' :
                                          isHC ? 'text-amber-600' :
                                          isRef ? 'text-blue-600' :
                                          isCert ? 'text-rose-600' : 'text-indigo-600';

                        return (
                          <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${badgeColor}`}>
                                  {p.codigo}
                                </span>
                                <span className="text-[10px] font-mono font-semibold text-slate-500">
                                  Disp: {p.stock_disponible ?? 0} {p.unidad_control}
                                </span>
                              </div>
                              <h4 className="font-bold text-xs text-slate-900 mb-1 flex items-center gap-1.5">
                                <FileText className={`w-4 h-4 ${iconColor}`} />
                                {p.nombre}
                              </h4>
                              <p className="text-[11px] text-slate-500 mb-3">
                                Control por {p.unidad_control} ({p.hojas_por_block || 50} hojas/block)
                              </p>
                            </div>

                              <div className="flex items-center gap-1 mb-3">
                                <span className="text-[10px] font-semibold text-slate-500 mr-1">Cant. rápida:</span>
                                {[1, 5, 10, 20, 50].map(preset => (
                                  <button
                                    key={preset}
                                    type="button"
                                    onClick={() => {
                                      const availStock = p.stock_disponible ?? 0;
                                      const bObj = batches.find(b => b.id === parseInt(customBatchId));
                                      const existingIdx = cartItems.findIndex(ci => ci.product_id === p.id && !ci.range_start && String(ci.batch_id || '') === String(customBatchId || ''));
                                      const currentQty = existingIdx >= 0 ? cartItems[existingIdx].cantidad : 0;

                                      if (currentQty + preset > availStock) {
                                        showToast(`⚠️ Stock insuficiente. '${p.nombre}' solo cuenta con ${availStock} ${p.unidad_control} disponibles en almacén.`, 'error');
                                        return;
                                      }

                                      if (existingIdx >= 0) {
                                        const updated = [...cartItems];
                                        updated[existingIdx].cantidad += preset;
                                        setCartItems(updated);
                                        showToast(`+${preset} ${p.unidad_control} de ${p.nombre} sumados al carrito`);
                                      } else {
                                        setCartItems([...cartItems, {
                                          product_id: p.id,
                                          product_nombre: p.nombre,
                                          batch_id: bObj ? bObj.id : null,
                                          batch_codigo: bObj ? bObj.codigo : null,
                                          cantidad: preset,
                                          max_stock: availStock,
                                          range_start: null,
                                          range_end: null
                                        }]);
                                        showToast(`Formato ${p.nombre} (${preset} ${p.unidad_control}) agregado`);
                                      }
                                    }}
                                    className="px-2 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold rounded-lg text-[10px] transition-colors"
                                  >
                                    +{preset}
                                  </button>
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const availStock = p.stock_disponible ?? 0;
                                  const bObj = batches.find(b => b.id === parseInt(customBatchId));
                                  const existingIdx = cartItems.findIndex(ci => ci.product_id === p.id && !ci.range_start && String(ci.batch_id || '') === String(customBatchId || ''));
                                  const currentQty = existingIdx >= 0 ? cartItems[existingIdx].cantidad : 0;

                                  if (currentQty + 1 > availStock) {
                                    showToast(`⚠️ Stock insuficiente. '${p.nombre}' solo cuenta con ${availStock} ${p.unidad_control} disponibles en almacén.`, 'error');
                                    return;
                                  }

                                  if (existingIdx >= 0) {
                                    const updated = [...cartItems];
                                    updated[existingIdx].cantidad += 1;
                                    setCartItems(updated);
                                    showToast(`1 ${p.unidad_control} de ${p.nombre} sumado al carrito`);
                                  } else {
                                    setCartItems([...cartItems, {
                                      product_id: p.id,
                                      product_nombre: p.nombre,
                                      batch_id: bObj ? bObj.id : null,
                                      batch_codigo: bObj ? bObj.codigo : null,
                                      cantidad: 1,
                                      max_stock: availStock,
                                      range_start: null,
                                      range_end: null
                                    }]);
                                    showToast(`Formato ${p.nombre} agregado al carrito`);
                                  }
                                }}
                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
                              >
                                <Plus className="w-4 h-4" /> Agregar {p.nombre}
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-3">Artículos en el Carrito de Entrega ({cartItems.length})</h3>
                  {cartItems.length === 0 ? (
                    <p className="text-xs text-slate-500 italic mb-6">No hay formatos agregados al carrito de entrega.</p>
                  ) : (
                    <div className="space-y-3 mb-6">
                      {cartItems.map((ci, idx) => {
                        const pObj = products.find(p => p.id === ci.product_id);
                        const availStock = !ci.range_start ? (pObj ? (pObj.stock_disponible ?? 0) : (ci.max_stock ?? 0)) : ci.max_stock;
                        const isOverflow = !ci.range_start && (ci.cantidad > availStock);

                        return (
                          <div key={idx} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all ${
                            isOverflow ? 'bg-red-50/90 border-red-300 shadow-sm' : 'bg-blue-50/50 border-blue-100'
                          }`}>
                            <div className="flex-1 mb-2 sm:mb-0 mr-4">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-slate-900">{ci.product_nombre}</p>
                                {isOverflow && (
                                  <span className="px-2 py-0.5 bg-red-600 text-white font-bold text-[10px] rounded-full animate-pulse flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Excede Stock ({availStock} disp.)
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                                {ci.batch_codigo ? `Lote ${ci.batch_codigo} | ` : ''}
                                {ci.range_start ? `Rango: ${ci.range_start}-${ci.range_end}` : `Disponible en Catálogo: ${availStock} ${pObj?.unidad_control || 'unidades'}`}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              {!ci.range_start && (
                                <div className="flex items-center gap-2">
                                  <label className="text-xs font-semibold text-slate-600">Cant. a entregar:</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={ci.cantidad}
                                    onChange={e => {
                                      const val = parseInt(e.target.value) || 0;
                                      if (val > availStock) {
                                        showToast(`⚠️ Excede stock disponible. El formato ${ci.product_nombre} solo cuenta con ${availStock} en almacén central.`, 'error');
                                      }
                                      const updated = [...cartItems];
                                      updated[idx].cantidad = val;
                                      setCartItems(updated);
                                    }}
                                    className={`w-28 border rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none focus:ring-2 ${
                                      isOverflow ? 'bg-white border-red-500 text-red-900 focus:ring-red-500' : 'bg-white border-slate-300 text-slate-900 focus:ring-blue-600'
                                    }`}
                                  />
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={() => setCartItems(cartItems.filter((_, i) => i !== idx))}
                                className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                                title="Quitar del carrito"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Observaciones de Entrega</label>
                    <input
                      type="text"
                      placeholder="Observaciones o comentarios opcionales..."
                      value={cartObservaciones}
                      onChange={e => setCartObservaciones(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Advertencia de bloqueo por exceso de stock */}
                  {cartItems.some(ci => {
                    if (ci.range_start) return false;
                    const pObj = products.find(p => p.id === ci.product_id);
                    const avail = pObj ? (pObj.stock_disponible ?? 0) : (ci.max_stock ?? 0);
                    return ci.cantidad > avail || ci.cantidad <= 0;
                  }) && (
                    <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-600 rounded-r-xl text-red-900 text-xs font-medium flex items-center gap-3 shadow-sm">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-red-950 text-sm">🚫 Entrega Bloqueada por Exceso de Stock</p>
                        <p className="mt-0.5">
                          Uno o más formatos en el carrito superan el stock disponible en almacén central. 
                          Por favor ajuste la cantidad solicitada para proceder a confirmar la entrega.
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    disabled={
                      cartItems.length === 0 || 
                      !cartDni || 
                      !cartReceptorName || 
                      cartItems.some(ci => {
                        if (ci.range_start) return false;
                        const pObj = products.find(p => p.id === ci.product_id);
                        const avail = pObj ? (pObj.stock_disponible ?? 0) : (ci.max_stock ?? 0);
                        return ci.cantidad > avail || ci.cantidad <= 0;
                      })
                    }
                    onClick={async () => {
                      const overflowItem = cartItems.find(ci => {
                        if (ci.range_start) return false;
                        const pObj = products.find(p => p.id === ci.product_id);
                        const avail = pObj ? (pObj.stock_disponible ?? 0) : (ci.max_stock ?? 0);
                        return ci.cantidad > avail;
                      });

                      if (overflowItem) {
                        const pObj = products.find(p => p.id === overflowItem.product_id);
                        const avail = pObj ? (pObj.stock_disponible ?? 0) : overflowItem.max_stock;
                        showToast(`Error: ${overflowItem.product_nombre} excede el stock disponible (${avail}).`, 'error');
                        return;
                      }

                      const res = await fetch('/api/deliveries', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          establishment_id: parseInt(cartEstablishment),
                          receptor_dni: cartDni,
                          receptor_nombre: cartReceptorName,
                          observaciones: cartObservaciones,
                          items: cartItems,
                          user_id: currentUser.id,
                          username: currentUser.username
                        })
                      });
                      const result = await res.json();
                      if (res.ok) {
                        showToast(`¡Entrega confirmada! Comprobante: ${result.numero_comprobante}`);
                        setCartItems([]);
                        setCartDni('');
                        setCartReceptorName('');
                        setCartObservaciones('');
                        loadData();
                        setActiveTab('comprobantes');
                      } else {
                        showToast(result.error || 'Error al registrar entrega', 'error');
                      }
                    }}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all"
                  >
                    Confirmar Entrega y Generar Comprobante PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 9. PERSONAL RECEPTOR (DNI, Nombres y Apellidos) --- */}
        {activeTab === 'personnel' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Personal Receptor Autorizado</h2>
                <p className="text-xs text-slate-500 mt-1">Registro de datos personales (DNI, Nombres y Apellidos). Sin vinculación fija a IPRESS para facilitar la rotación de personal.</p>
              </div>
              <button
                onClick={() => { setPersForm({ id: null, dni: '', nombres: '', apellidos: '' }); setShowPersModal(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" /> Registrar Personal
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar personal por DNI, nombres o apellidos..."
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setPersPage(1); }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {(() => {
                const filteredPers = personnel.filter((p: any) => {
                  const sTerm = (searchTerm || '').toLowerCase();
                  const pDni = String(p?.dni || '');
                  const pNom = String(p?.nombres || '').toLowerCase();
                  const pApe = String(p?.apellidos || '').toLowerCase();
                  return pDni.includes(sTerm) || pNom.includes(sTerm) || pApe.includes(sTerm);
                });

                const paginatedPers = filteredPers.slice((persPage - 1) * persPageSize, persPage * persPageSize);

                return (
                  <>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                            <th className="py-3.5 px-4">DNI</th>
                            <th className="py-3.5 px-4">Nombres</th>
                            <th className="py-3.5 px-4">Apellidos</th>
                            <th className="py-3.5 px-4">Fecha de Registro</th>
                            <th className="py-3.5 px-4 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedPers.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-slate-500 italic">
                                No se encontró ningún personal con el filtro "{searchTerm}"
                              </td>
                            </tr>
                          ) : (
                            paginatedPers.map((p: any, idx: number) => (
                              <tr key={p.id} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/80'}>
                                <td className="py-3 px-4 font-mono font-bold text-blue-600">{p.dni}</td>
                                <td className="py-3 px-4 font-bold text-slate-900">{p.nombres || '-'}</td>
                                <td className="py-3 px-4 font-bold text-slate-900">{p.apellidos || '-'}</td>
                                <td className="py-3 px-4 text-slate-500">{p.created_at?.substring(0, 10) || '-'}</td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => { setPersForm({ id: p.id, dni: p.dni || '', nombres: p.nombres || '', apellidos: p.apellidos || '' }); setShowPersModal(true); }}
                                      className="p-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-slate-600 transition-colors"
                                      title="Editar"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={async () => {
                                        if (confirm(`¿Eliminar del registro al personal ${p.nombres} ${p.apellidos}?`)) {
                                          const res = await fetch(`/api/personnel/${p.id}?username=${currentUser.username}`, { method: 'DELETE' });
                                          if (res.ok) {
                                            showToast('Personal eliminado del registro');
                                            loadData();
                                          } else {
                                            showToast('Error al eliminar', 'error');
                                          }
                                        }
                                      }}
                                      className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-colors"
                                      title="Eliminar"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <PaginationControls
                      currentPage={persPage}
                      totalItems={filteredPers.length}
                      pageSize={persPageSize}
                      onPageChange={setPersPage}
                      onPageSizeChange={setPersPageSize}
                    />
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* --- 10. COMPROBANTES Y REPORTES --- */}
        {activeTab === 'comprobantes' && (() => {
          const filteredDeliveries = deliveries.filter((d: any) => {
            // Establishment filter
            if (reportEstId && reportEstId !== 'todos' && String(d.establishment_id) !== String(reportEstId)) {
              return false;
            }
            // Date start filter
            if (reportStartDate && d.fecha_entrega < reportStartDate) {
              return false;
            }
            // Date end filter
            if (reportEndDate && d.fecha_entrega > reportEndDate) {
              return false;
            }
            // Text search filter
            if (reportSearchQuery.trim()) {
              const q = reportSearchQuery.toLowerCase().trim();
              const compNum = (d.numero_comprobante || '').toLowerCase();
              const estName = (d.establishment_nombre || '').toLowerCase();
              const recName = (d.receptor_nombre || '').toLowerCase();
              const recDni = (d.receptor_dni || '').toLowerCase();
              if (!compNum.includes(q) && !estName.includes(q) && !recName.includes(q) && !recDni.includes(q)) {
                return false;
              }
            }
            return true;
          });

          const totalItemsDelivered = filteredDeliveries.reduce((sum: number, d: any) => {
            if (!d.items) return sum;
            return sum + d.items.reduce((iSum: number, item: any) => iSum + (item.cantidad || 0), 0);
          }, 0);

          const uniqueEstsCount = new Set(filteredDeliveries.map((d: any) => d.establishment_id)).size;

          const exportFilteredReportToExcel = () => {
            const dataToExport = filteredDeliveries.map(d => ({
              'N° Comprobante': d.numero_comprobante,
              'Fecha de Entrega': d.fecha_entrega,
              'Establecimiento Destino': d.establishment_nombre,
              'RENAES': establishments.find(e => e.id === d.establishment_id)?.renaes || '-',
              'DNI Receptor': d.receptor_dni,
              'Nombre Receptor': d.receptor_nombre,
              'Responsable Almacén': d.username || 'Sistema',
              'Estado': d.status || 'completado',
              'Cant. Ítems': d.items ? d.items.length : 0,
              'Detalle Formatos': d.items ? d.items.map((i: any) => `${i.product_nombre} (${i.cantidad}${i.range_start ? ` [${i.range_start}-${i.range_end}]` : ''})`).join('; ') : ''
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte_Entregas");
            XLSX.writeFile(workbook, `Reporte_Entregas_${reportEstId !== 'todos' ? 'IPRESS_' + reportEstId : 'General'}_${new Date().toISOString().split('T')[0]}.xlsx`);
            showToast("Reporte exportado a Excel exitosamente");
          };

          const generateFilteredSummaryPDF = () => {
            const doc = new jsPDF();
            doc.setFontSize(14);
            doc.setTextColor(30, 41, 59);
            doc.text('DIRESA PIURA - SUB REGIÓN DE SALUD LUCIANO CASTILLO COLONNA', 14, 15);
            doc.setFontSize(11);
            doc.text('REPORTE HISTÓRICO DE ENTREGAS Y COMPROBANTES', 14, 22);
            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139);
            const selectedEstName = reportEstId !== 'todos' ? establishments.find(e => String(e.id) === String(reportEstId))?.nombre || 'Establecimiento' : 'Todos los Establecimientos';
            doc.text(`Filtros: IPRESS: ${selectedEstName} | Desde: ${reportStartDate || 'Inicio'} | Hasta: ${reportEndDate || 'Actual'}`, 14, 28);
            
            const tableData = filteredDeliveries.map(d => [
              d.numero_comprobante,
              d.fecha_entrega,
              d.establishment_nombre,
              `${d.receptor_nombre}\n(DNI: ${d.receptor_dni})`,
              d.items ? d.items.map((i: any) => `${i.product_nombre}: ${i.cantidad}`).join(', ') : '-',
              d.status || 'Completado'
            ]);

            autoTable(doc, {
              startY: 34,
              head: [['Comprobante', 'Fecha', 'Establecimiento Destino', 'Personal Receptor', 'Detalle Formatos', 'Estado']],
              body: tableData,
              styles: { fontSize: 7.5 },
              headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] }
            });

            doc.save(`Reporte_Entregas_${new Date().toISOString().split('T')[0]}.pdf`);
            showToast('Reporte PDF descargado exitosamente');
          };

          return (
            <div className="space-y-6">
              {/* Header con botón de exportar reporte consolidado */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-6 h-6 text-blue-600" /> Comprobantes de Entrega & Reportes Históricos
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Filtre por rango de fechas y establecimiento (IPRESS) para generar y exportar reportes específicos.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={generateFilteredSummaryPDF}
                    disabled={filteredDeliveries.length === 0}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow transition-colors"
                  >
                    <Printer className="w-4 h-4 text-blue-400" /> Exportar Reporte PDF
                  </button>
                  <button
                    onClick={exportFilteredReportToExcel}
                    disabled={filteredDeliveries.length === 0}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow transition-colors"
                  >
                    <Download className="w-4 h-4" /> Exportar a Excel
                  </button>
                </div>
              </div>

              {/* Panel de Filtros */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-blue-600" /> Filtros de Búsqueda y Reporte
                  </h3>
                  {(reportStartDate || reportEndDate || reportEstId !== 'todos' || reportSearchQuery) && (
                    <button
                      onClick={() => {
                        setReportStartDate('');
                        setReportEndDate('');
                        setReportEstId('todos');
                        setReportSearchQuery('');
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Limpiar Filtros
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Filtro Establecimiento */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Establecimiento (IPRESS)
                    </label>
                    <SearchableEstablishmentSelect
                      establishments={establishments}
                      value={reportEstId}
                      onChange={val => setReportEstId(val || 'todos')}
                      includeAllOption
                      allLabel="-- Todos los Establecimientos --"
                    />
                  </div>

                  {/* Fecha Inicio */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> Fecha Inicio (Desde)
                    </label>
                    <input
                      type="date"
                      value={reportStartDate}
                      onChange={e => setReportStartDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Fecha Fin */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> Fecha Fin (Hasta)
                    </label>
                    <input
                      type="date"
                      value={reportEndDate}
                      onChange={e => setReportEndDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Búsqueda por Texto */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Búsqueda General
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="N° Comprobante, DNI, Receptor..."
                        value={reportSearchQuery}
                        onChange={e => setReportSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Presets Rápidos de Fechas */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 mr-1">Rango rápido:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      setReportStartDate(today);
                      setReportEndDate(today);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 text-[11px] font-semibold rounded-lg transition-colors"
                  >
                    Hoy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      const d7 = new Date();
                      d7.setDate(today.getDate() - 7);
                      setReportStartDate(d7.toISOString().split('T')[0]);
                      setReportEndDate(today.toISOString().split('T')[0]);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 text-[11px] font-semibold rounded-lg transition-colors"
                  >
                    Últimos 7 días
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                      setReportStartDate(firstDay.toISOString().split('T')[0]);
                      setReportEndDate(today.toISOString().split('T')[0]);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 text-[11px] font-semibold rounded-lg transition-colors"
                  >
                    Este Mes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReportStartDate('2026-01-01');
                      setReportEndDate('2026-12-31');
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 text-[11px] font-semibold rounded-lg transition-colors"
                  >
                    Año 2026
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReportStartDate('');
                      setReportEndDate('');
                      setReportEstId('todos');
                      setReportSearchQuery('');
                    }}
                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-[11px] font-semibold rounded-lg transition-colors ml-auto"
                  >
                    Ver Todo
                  </button>
                </div>
              </div>

              {/* KPI Cards de Datos Filtrados */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">Comprobantes Filtrados</p>
                    <p className="text-xl font-black text-slate-900">{filteredDeliveries.length} <span className="text-xs font-normal text-slate-500">de {deliveries.length}</span></p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">IPRESS Atendidas</p>
                    <p className="text-xl font-black text-slate-900">{uniqueEstsCount}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Formatos Entregados</p>
                    <p className="text-xl font-black text-slate-900">{totalItemsDelivered.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Tabla de Resultados */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900">Listado de Comprobantes Filtrados</h3>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    Total {filteredDeliveries.length} registro(s)
                  </span>
                </div>

                {filteredDeliveries.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                    <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No se encontraron comprobantes de entrega</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      No hay registros de entrega que coincidan con los filtros de rango de fechas o establecimiento seleccionados.
                    </p>
                    <button
                      onClick={() => {
                        setReportStartDate('');
                        setReportEndDate('');
                        setReportEstId('todos');
                        setReportSearchQuery('');
                      }}
                      className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow"
                    >
                      Restablecer Filtros
                    </button>
                  </div>
                ) : (
                  <>
                    {(() => {
                      const paginatedDeliveries = filteredDeliveries.slice((reportPage - 1) * reportPageSize, reportPage * reportPageSize);
                      return (
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                                <th className="py-3.5 px-4">Comprobante</th>
                                <th className="py-3.5 px-4">Fecha</th>
                                <th className="py-3.5 px-4">Establecimiento Destino</th>
                                <th className="py-3.5 px-4">Receptor (DNI y Nombre)</th>
                                <th className="py-3.5 px-4">Responsable Almacén</th>
                                <th className="py-3.5 px-4 text-right">Acciones PDF</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {paginatedDeliveries.map((d: any, idx: number) => (
                                <tr key={d.id} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/80'}>
                                  <td className="py-3 px-4 font-mono font-bold text-blue-600">
                                    {d.numero_comprobante}
                                    {d.status === 'anulado' && (
                                      <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">
                                        ANULADO
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 px-4 text-slate-600 font-medium">{d.fecha_entrega}</td>
                                  <td className="py-3 px-4 font-bold text-slate-900">{d.establishment_nombre}</td>
                                  <td className="py-3 px-4 text-slate-700 font-medium">{d.receptor_nombre} ({d.receptor_dni})</td>
                                  <td className="py-3 px-4 text-slate-500 font-medium">{d.username || 'Sistema'}</td>
                                  <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() => generatePDF(d)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow"
                                      >
                                        <Printer className="w-3.5 h-3.5" /> Descargar PDF
                                      </button>
                                      {d.status !== 'anulado' && (
                                        <button
                                          onClick={async () => {
                                            if (confirm(`¿Anular la entrega comprobante ${d.numero_comprobante}?`)) {
                                              const res = await fetch(`/api/deliveries/${d.id}?username=${currentUser.username}`, { method: 'DELETE' });
                                              if (res.ok) {
                                                showToast('Comprobante anulado');
                                                loadData();
                                              } else {
                                                showToast('Error al anular', 'error');
                                              }
                                            }
                                          }}
                                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-semibold rounded-lg transition-colors flex items-center gap-1"
                                          title="Anular comprobante"
                                        >
                                          <X className="w-3.5 h-3.5" /> Anular
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}

                    <PaginationControls
                      currentPage={reportPage}
                      totalItems={filteredDeliveries.length}
                      pageSize={reportPageSize}
                      onPageChange={setReportPage}
                      onPageSizeChange={setReportPageSize}
                    />
                  </>
                )}
              </div>
            </div>
          );
        })()}

        {/* --- 10.B PAQUETES Y QR (OCR & GESTIÓN DE PAQUETES) --- */}
        {activeTab === 'packages' && (() => {
          const filteredPackages = warehousePackages.filter((pkg: any) => {
            if (pkgFilterEst !== 'todos' && String(pkg.establishment_id) !== String(pkgFilterEst)) return false;
            if (pkgFilterStatus !== 'todos' && pkg.estado !== pkgFilterStatus) return false;
            if (pkgSearch.trim()) {
              const q = pkgSearch.toLowerCase().trim();
              const code = (pkg.codigo_paquete || '').toLowerCase();
              const est = (pkg.establishment_nombre || '').toLowerCase();
              const renaes = (pkg.renaes || '').toLowerCase();
              const prod = (pkg.product_nombre || '').toLowerCase();
              const lote = (pkg.batch_codigo || '').toLowerCase();
              if (!code.includes(q) && !est.includes(q) && !renaes.includes(q) && !prod.includes(q) && !lote.includes(q)) {
                return false;
              }
            }
            return true;
          });

          return (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <QrCode className="w-6 h-6 text-purple-600" /> Gestión de Paquetes, OCR de Etiquetas & Códigos QR
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Escanee etiquetas de proveedores con OCR, genere identificadores únicos con QR y controle saldos e historiales.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPackageForm({
                        product_id: products[0]?.id ? String(products[0].id) : '',
                        establishment_id: '',
                        cantidad_inicial: 3000,
                        batch_id: batches[0]?.id ? String(batches[0].id) : '',
                        range_start: '00001',
                        range_end: '03000',
                        numero_paquete: '01/01',
                        ubicacion_almacen: 'Almacén Central - Sector A',
                        foto_etiqueta: '',
                        ocr_raw_text: ''
                      });
                      setPackageModalMode('create');
                      setShowPackageModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-purple-600/20"
                  >
                    <Plus className="w-4 h-4" /> Registrar Nuevo Paquete / OCR
                  </button>
                </div>
              </div>

              {/* Filtros */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-purple-600" /> Filtros de Paquetes en Almacén
                  </h3>
                  {(pkgSearch || pkgFilterEst !== 'todos' || pkgFilterStatus !== 'todos') && (
                    <button
                      onClick={() => {
                        setPkgSearch('');
                        setPkgFilterEst('todos');
                        setPkgFilterStatus('todos');
                      }}
                      className="text-xs font-semibold text-purple-600 hover:underline flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Limpiar Filtros
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Establecimiento (IPRESS)</label>
                    <SearchableEstablishmentSelect
                      establishments={establishments}
                      value={pkgFilterEst}
                      onChange={val => setPkgFilterEst(val || 'todos')}
                      includeAllOption
                      allLabel="-- Todas las IPRESS --"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Estado del Paquete</label>
                    <select
                      value={pkgFilterStatus}
                      onChange={e => setPkgFilterStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
                    >
                      <option value="todos">-- Todos los Estados --</option>
                      <option value="en_almacen">En Almacén (Con Saldo)</option>
                      <option value="entregado">Entregado (Agotado)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Búsqueda Rápida</label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Código de paquete, RENAES, Producto..."
                        value={pkgSearch}
                        onChange={e => setPkgSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de Paquetes en Tarjetas / Tabla */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Listado de Paquetes Identificados ({filteredPackages.length})</h3>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    Control de Saldo y QR Único
                  </span>
                </div>

                {filteredPackages.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                    <QrCode className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No se encontraron paquetes registrados</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      Utilice el botón "Registrar Nuevo Paquete / OCR" para fotografiar una etiqueta o registrar manualmente.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPackages.map((pkg: any) => {
                      const isComplete = pkg.saldo <= 0;
                      return (
                        <div key={pkg.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-purple-400 transition-all shadow-sm">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-mono font-bold text-[11px] rounded-lg">
                                {pkg.codigo_paquete}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {isComplete ? 'Entregado (0 Saldo)' : `Saldo: ${pkg.saldo.toLocaleString()} u.`}
                              </span>
                            </div>

                            <p className="text-xs font-bold text-slate-900 mb-1">{pkg.product_nombre}</p>
                            <p className="text-[11px] text-slate-600 mb-2 font-medium">
                              IPRESS: <span className="font-bold text-slate-900">{pkg.establishment_nombre || 'Almacén Central'}</span> ({pkg.renaes || 'CENTRAL'})
                            </p>

                            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 space-y-0.5 mb-3">
                              <p>Lote: <span className="font-bold text-blue-600">Lote {pkg.batch_codigo || 'General'}</span> | Pqt: {pkg.numero_paquete || '01/01'}</p>
                              {pkg.range_start && (
                                <p className="text-emerald-700 font-bold">Rango: {pkg.range_start} - {pkg.range_end}</p>
                              )}
                              <p className="text-slate-500 text-[10px]">Ubicación: {pkg.ubicacion_almacen}</p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={async () => {
                                const res = await fetch(`/api/warehouse/packages/${pkg.id}`);
                                const data = await res.json();
                                setSelectedPackage(data);
                                setPackageModalMode('view');
                                setShowPackageModal(true);
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-xs shadow transition-colors"
                            >
                              <QrCode className="w-3.5 h-3.5" /> Ficha & QR
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* --- 11. USUARIOS & AUDITORÍA (ADMIN) --- */}
        {activeTab === 'users' && currentUser.role === 'admin' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Gestión de Usuarios y Auditoría</h2>
                <p className="text-xs text-slate-500 mt-1">Control de accesos, permisos y registro de auditoría de acciones del sistema.</p>
              </div>
              <button
                onClick={() => {
                  setUserForm({ id: null, username: '', password: '', nombre_completo: '', role: 'user', permissions: { consultar: true, registrar: true, modificar: false, anular: false, importar: false, reportes: true } });
                  setShowUserModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" /> Nuevo Usuario
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-base font-bold text-slate-900 mb-4">Usuarios del Sistema</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase">
                        <th className="pb-3">Usuario</th>
                        <th className="pb-3">Nombre Completo</th>
                        <th className="pb-3">Rol</th>
                        <th className="pb-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {usersList.map((u: any) => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="py-3 font-mono font-bold text-blue-600">{u.username}</td>
                          <td className="py-3 font-medium text-slate-900">{u.nombre_completo}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-full text-[10px] font-semibold uppercase">{u.role}</span>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => { setUserForm(u); setShowUserModal(true); }}
                                className="p-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded text-slate-600"
                                title="Editar"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {u.username !== 'admin' && (
                                <button
                                  onClick={async () => {
                                    if (confirm(`¿Eliminar al usuario ${u.username}?`)) {
                                      const res = await fetch(`/api/users/${u.id}?username=${currentUser.username}`, { method: 'DELETE' });
                                      if (res.ok) {
                                        showToast('Usuario eliminado');
                                        loadData();
                                      } else {
                                        showToast('Error al eliminar', 'error');
                                      }
                                    }
                                  }}
                                  className="p-1 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-base font-bold text-slate-900 mb-4">Registro de Auditoría</h3>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase">
                        <th className="pb-3">Fecha</th>
                        <th className="pb-3">Usuario</th>
                        <th className="pb-3">Acción</th>
                        <th className="pb-3">Detalle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {auditLogs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="py-2.5 text-slate-500">{log.created_at?.substring(0, 19)}</td>
                          <td className="py-2.5 font-bold text-slate-700">{log.username}</td>
                          <td className="py-2.5 font-mono text-blue-600">{log.action}</td>
                          <td className="py-2.5 text-slate-600">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Configuración del Token de API Perú (Solo Administrador) */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Key className="w-5 h-5 text-amber-500" /> Configuración de Integración API Perú (Consultas DNI)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Solo visible para Administradores. Configure su Token Bearer otorgado por API Perú (apiperu.dev) para la búsqueda automática de personal por DNI.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold font-mono text-[10px] rounded-lg flex items-center gap-1 shrink-0">
                    <Lock className="w-3 h-3 text-amber-700" /> Exclusivo Administrador
                  </span>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSavingToken(true);
                  try {
                    const res = await fetch('/api/settings/apiperu', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ token: apiPeruTokenInput, username: currentUser.username })
                    });
                    const data = await res.json();
                    if (res.ok) {
                      showToast('✅ Token de API Perú actualizado correctamente');
                      loadData();
                    } else {
                      showToast(data.error || 'Error al guardar el Token', 'error');
                    }
                  } catch (err: any) {
                    showToast('Error de conexión', 'error');
                  } finally {
                    setIsSavingToken(false);
                  }
                }} className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Clave Token de API Perú (Bearer Token)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        required
                        value={apiPeruTokenInput}
                        onChange={e => setApiPeruTokenInput(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-amber-500"
                        placeholder="Ingrese su Token Bearer de API Perú (ej. f022c3c042cba713a65e69d8ab9299c...)"
                      />
                      <button
                        type="submit"
                        disabled={isSavingToken}
                        className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow flex items-center justify-center gap-2 transition-colors shrink-0"
                      >
                        {isSavingToken ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Guardar Token
                      </button>
                    </div>
                  </div>

                  {/* Probar Token */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Search className="w-4 h-4 text-blue-600" /> Probar Funcionamiento del Token con un DNI
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        maxLength={8}
                        value={apiPeruTestDNI}
                        onChange={e => setApiPeruTestDNI(e.target.value)}
                        className="w-36 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-mono"
                        placeholder="8 dígitos"
                      />
                      <button
                        type="button"
                        disabled={isTestingToken || apiPeruTestDNI.length !== 8}
                        onClick={async () => {
                          setIsTestingToken(true);
                          setApiPeruTestResult(null);
                          try {
                            const res = await fetch(`/api/external/dni/${apiPeruTestDNI}`);
                            const data = await res.json();
                            setApiPeruTestResult({ status: res.status, ...data });
                          } catch (err: any) {
                            setApiPeruTestResult({ error: 'Error de red o conexión' });
                          } finally {
                            setIsTestingToken(false);
                          }
                        }}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        {isTestingToken ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                        Probar Consulta DNI
                      </button>
                    </div>

                    {apiPeruTestResult && (
                      <div className={`p-3 rounded-xl border text-xs font-mono ${
                        apiPeruTestResult.success ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'
                      }`}>
                        {apiPeruTestResult.success ? (
                          <div>
                            <p className="font-bold text-emerald-900">✅ Consulta Exitosa en API Perú:</p>
                            <p className="mt-1">Nombres: <span className="font-bold">{apiPeruTestResult.nombres}</span></p>
                            <p>Apellidos: <span className="font-bold">{apiPeruTestResult.apellidos}</span></p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-bold text-red-950">❌ Error al consultar API Perú:</p>
                            <p className="mt-0.5 text-[11px]">{apiPeruTestResult.error || 'No se pudo obtener datos con este Token'}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* --- MODALS --- */}

      {/* New / Edit Programming Modal */}
      {showProgModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {progForm.id ? 'Editar Programación de FUA' : 'Nueva Programación de FUA'}
            </h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const res = await fetch('/api/programming', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...progForm, user_id: currentUser.id, username: currentUser.username })
              });
              if (res.ok) {
                showToast(progForm.id ? 'Programación actualizada' : 'Programación creada exitosamente');
                setShowProgModal(false);
                loadData();
              } else {
                const err = await res.json();
                showToast(err.error || 'Error al programar', 'error');
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Establecimiento de Salud</label>
                <SearchableEstablishmentSelect
                  establishments={establishments}
                  value={progForm.establishment_id}
                  onChange={val => setProgForm({ ...progForm, establishment_id: val })}
                  placeholder="Buscar IPRESS por RENAES o Nombre..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Lote</label>
                <select
                  required
                  value={progForm.batch_id}
                  onChange={e => setProgForm({ ...progForm, batch_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                >
                  <option value="">Seleccione lote...</option>
                  {batches.map(b => <option key={b.id} value={b.id}>Lote {b.codigo} - {b.descripcion}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Cantidad a Programar</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={progForm.cantidad}
                  onChange={e => setProgForm({ ...progForm, cantidad: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Origen</label>
                <select
                  value={progForm.origen}
                  onChange={e => setProgForm({ ...progForm, origen: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                >
                  <option value="proveedor">Proveedor</option>
                  <option value="impresion_propia">Impresión Propia</option>
                </select>
              </div>

              {progForm.origen === 'proveedor' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Proveedor</label>
                  <select
                    value={progForm.supplier_id}
                    onChange={e => setProgForm({ ...progForm, supplier_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                  >
                    <option value="">Seleccione proveedor...</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowProgModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow">
                  {progForm.id ? 'Guardar Cambios' : 'Guardar Programación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Excel Import Modal (Admin Only) */}
      {showProgBulkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-600" /> Carga Masiva de Programación FUA (Excel)
                </h3>
                <p className="text-xs text-slate-500">Exclusivo para Administradores del Sistema.</p>
              </div>
              <button
                onClick={() => setShowProgBulkModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {currentUser.role !== 'admin' ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-medium">
                🚫 Acceso restringido. Solo usuarios con rol Administrador tienen permiso para realizar cargas masivas.
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <p className="text-xs font-bold text-slate-800">1. Descargar Plantilla Excel Ejemplo</p>
                      <p className="text-[11px] text-slate-500">Utilice esta plantilla con las columnas estructuradas (RENAES, Lote, Cantidad, Origen, Proveedor).</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const template = [
                          {
                            'RENAES': '0001',
                            'Establecimiento': 'P.S. BELLAVISTA',
                            'Lote': '27',
                            'Cantidad': 1000,
                            'Origen': 'proveedor',
                            'Proveedor': 'IMP. SANTILLANA'
                          },
                          {
                            'RENAES': '0002',
                            'Establecimiento': 'C.S. IGNACIO ESCUDERO',
                            'Lote': '27',
                            'Cantidad': 2500,
                            'Origen': 'impresion_propia',
                            'Proveedor': ''
                          }
                        ];
                        const ws = XLSX.utils.json_to_sheet(template);
                        const wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, "Plantilla_Programacion");
                        XLSX.writeFile(wb, "Plantilla_Registro_Masivo_FUAs.xlsx");
                        showToast("Plantilla Excel descargada");
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-semibold rounded-lg text-xs transition-colors shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" /> Descargar Plantilla
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      2. Seleccionar Archivo Excel (.xlsx, .xls, .csv)
                    </label>
                    <input
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setBulkFileName(file.name);
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          try {
                            const bstr = evt.target?.result;
                            const wb = XLSX.read(bstr, { type: 'binary' });
                            const wsname = wb.SheetNames[0];
                            const ws = wb.Sheets[wsname];
                            const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
                            setBulkExcelData(data);
                            showToast(`Archivo '${file.name}' leído correctamente. ${data.length} filas encontradas.`);
                          } catch (err: any) {
                            showToast('Error al procesar el archivo Excel', 'error');
                          }
                        };
                        reader.readAsBinaryString(file);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                  </div>
                </div>

                {bulkExcelData.length > 0 && (
                  <div className="flex-1 overflow-y-auto space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                      <span>Vista previa de datos a importar ({bulkExcelData.length} filas):</span>
                      <span className="font-mono text-[10px] text-blue-600">{bulkFileName}</span>
                    </div>
                    <div className="overflow-x-auto max-h-48 border rounded-lg bg-white">
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="bg-slate-100 text-slate-600 uppercase border-b">
                            <th className="p-2">#</th>
                            <th className="p-2">RENAES / IPRESS</th>
                            <th className="p-2">Lote</th>
                            <th className="p-2">Cantidad</th>
                            <th className="p-2">Origen</th>
                            <th className="p-2">Proveedor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {bulkExcelData.slice(0, 10).map((row: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2 font-mono font-bold text-slate-500">{idx + 1}</td>
                              <td className="p-2 font-semibold text-slate-900">{row.RENAES || row.establishment || row.renaes || '-'}</td>
                              <td className="p-2 font-bold text-blue-600">{row.Lote || row.lote || '-'}</td>
                              <td className="p-2 font-mono font-bold">{row.Cantidad || row.cantidad || 0}</td>
                              <td className="p-2 text-slate-600">{row.Origen || row.origen || 'proveedor'}</td>
                              <td className="p-2 text-slate-500">{row.Proveedor || row.proveedor || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {bulkExcelData.length > 10 && (
                      <p className="text-[10px] text-slate-500 italic text-center">
                        ...y {bulkExcelData.length - 10} filas más.
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowProgBulkModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={isUploadingBulk || bulkExcelData.length === 0}
                    onClick={async () => {
                      if (bulkExcelData.length === 0) {
                        showToast('No hay datos en el archivo cargado', 'error');
                        return;
                      }
                      setIsUploadingBulk(true);
                      try {
                        const res = await fetch('/api/programming/bulk', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            items: bulkExcelData,
                            user_id: currentUser.id,
                            username: currentUser.username,
                            role: currentUser.role
                          })
                        });
                        const result = await res.json();
                        if (res.ok) {
                          showToast(`Se procesaron exitosamente ${result.count} programaciones.`);
                          if (result.errors && result.errors.length > 0) {
                            showToast(`⚠️ Observación: ${result.errors[0]}`, 'error');
                          }
                          setShowProgBulkModal(false);
                          setBulkExcelData([]);
                          setBulkFileName('');
                          loadData();
                        } else {
                          showToast(result.error || 'Error al procesar carga masiva', 'error');
                        }
                      } catch (err: any) {
                        showToast('Error al conectar con el servidor', 'error');
                      } finally {
                        setIsUploadingBulk(false);
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow"
                  >
                    {isUploadingBulk ? 'Procesando...' : `Confirmar Carga (${bulkExcelData.length} filas)`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* New Reception Modal */}
      {showRecModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Registrar Recepción en Almacén</h3>
                <p className="text-xs text-slate-500 mt-0.5">Ingreso de FUAs programadas o papelería a demanda a inventario.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowQrModal(true);
                  setQrVerificationResult(null);
                  setQrInput('');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-xs border border-purple-200 shadow-sm transition-colors"
              >
                <QrCode className="w-4 h-4 text-purple-600" /> Verificación QR Proveedor
              </button>
            </div>

            {/* Segmented control: FUAs vs Papelería a demanda */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setRecType('fua');
                  setRecForm({ ...recForm, product_id: '' });
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  recType === 'fua' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📄 Formatos FUAs (Programados por IPRESS)
              </button>
              <button
                type="button"
                onClick={() => {
                  setRecType('demanda');
                  setRecForm({ ...recForm, programming_id: '', range_start: 0, range_end: 0, establishment_id: '' });
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  recType === 'demanda' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📚 Papelería a Demanda (HIS, Recetarios, HC)
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();

              if (recType === 'fua' && !recForm.programming_id) {
                showToast('Debe seleccionar una programación de FUA para continuar', 'error');
                return;
              }

              if (recType === 'demanda' && !recForm.product_id) {
                showToast('Debe seleccionar el tipo de formato/papelería a ingresar', 'error');
                return;
              }

              const res = await fetch('/api/receptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...recForm, user_id: currentUser.id, username: currentUser.username })
              });

              if (res.ok) {
                showToast('Recepción registrada exitosamente en almacén');
                setShowRecModal(false);
                loadData();
              } else {
                const err = await res.json();
                showToast(err.error || 'Error al registrar recepción', 'error');
              }
            }} className="space-y-4">

              {recType === 'fua' ? (
                /* FUA Programming Selector (Searchable 200+ list) */
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    1. Selección Interactiva de FUA Programada (Búsqueda por RENAES, Nombre, Lote o Rango)
                  </label>
                  <SearchableProgrammingSelect
                    programming={programming}
                    value={recForm.programming_id}
                    onChange={prog => {
                      if (!prog) {
                        setRecForm({ ...recForm, programming_id: '' });
                        return;
                      }

                      const progRecs = receptions.filter((r: any) => String(r.programming_id) === String(prog.id));
                      let maxEnd = 0;
                      for (const pr of progRecs) {
                        if (pr.range_end && pr.range_end > maxEnd) maxEnd = pr.range_end;
                      }

                      const calculatedStart = maxEnd > 0 ? maxEnd + 1 : prog.range_start;
                      const pendingQty = Math.max(1, prog.cantidad - (prog.cantidad_recibida || 0));
                      const calculatedEnd = calculatedStart + pendingQty - 1;

                      setRecForm({
                        ...recForm,
                        programming_id: String(prog.id),
                        establishment_id: String(prog.establishment_id),
                        batch_id: String(prog.batch_id),
                        supplier_id: String(prog.supplier_id || ''),
                        cantidad_recibida: pendingQty,
                        range_start: calculatedStart,
                        range_end: calculatedEnd,
                        product_id: ''
                      });
                    }}
                  />

                  {recForm.programming_id && (
                    <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-1">
                      <p className="font-bold text-blue-900 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        IPRESS Vinculada: {establishments.find(e => String(e.id) === String(recForm.establishment_id))?.nombre}
                      </p>
                      <p className="text-slate-600 font-mono text-[11px]">
                        Lote: {batches.find(b => String(b.id) === String(recForm.batch_id))?.codigo || 'General'} | 
                        Proveedor: {suppliers.find(s => String(s.id) === String(recForm.supplier_id))?.nombre || 'Interno'}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Non-FUA Demand Paperwork Selector (Central Warehouse Stock) */
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-emerald-950">Ingreso a Almacén Central DIRESA</p>
                      <p className="text-[11px] mt-0.5">
                        Los formatos a demanda (HIS, recetarios, etc.) se recepcionan directamente al stock central sin requerir vinculación fija a un centro de salud.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                      Seleccione el Formato / Papelería
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                      {products.filter(p => p.tipo === 'otro').map((p: any) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setRecForm({ ...recForm, product_id: String(p.id) })}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            String(recForm.product_id) === String(p.id)
                              ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-md'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-500'
                          }`}
                        >
                          <p className="font-bold text-[11px] truncate">{p.nombre}</p>
                          <p className={`text-[10px] ${String(recForm.product_id) === String(p.id) ? 'text-emerald-100' : 'text-slate-500'}`}>
                            {p.codigo} ({p.unidad_control})
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Fecha Recepción</label>
                  <input
                    type="date"
                    required
                    value={recForm.fecha_recepcion}
                    onChange={e => setRecForm({ ...recForm, fecha_recepcion: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Guía / Factura de Proveedor</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. GR-2026-004812"
                    value={recForm.documento}
                    onChange={e => setRecForm({ ...recForm, documento: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Cantidad</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={recForm.cantidad_recibida}
                    onChange={e => {
                      const newQty = parseInt(e.target.value) || 0;
                      const newEnd = (recForm.range_start || 1) + newQty - 1;
                      setRecForm({ ...recForm, cantidad_recibida: newQty, range_end: newEnd });
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-bold"
                  />
                </div>
                {recType === 'fua' ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Rango Inicio</label>
                      <input
                        type="number"
                        value={recForm.range_start}
                        onChange={e => {
                          const newStart = parseInt(e.target.value) || 0;
                          const newEnd = newStart + (recForm.cantidad_recibida || 1) - 1;
                          setRecForm({ ...recForm, range_start: newStart, range_end: newEnd });
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Rango Fin (Auto)</label>
                      <input
                        type="number"
                        readOnly
                        value={recForm.range_end}
                        className="w-full bg-slate-100 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono font-bold"
                      />
                    </div>
                  </>
                ) : (
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Lote (Opcional)</label>
                    <select
                      value={recForm.batch_id}
                      onChange={e => setRecForm({ ...recForm, batch_id: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                    >
                      <option value="">Sin lote específico</option>
                      {batches.map(b => <option key={b.id} value={b.id}>Lote {b.codigo}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowRecModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow">Confirmar Recepción</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code & OCR Label Reader & Programmed FUA Verification Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Verificación de FUAs e Ingresos (OCR / QR)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Valide si la cantidad ingresada corresponde a un <b>Ingreso Total</b> o <b>Ingreso Parcial</b> del establecimiento.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selector de Método: OCR vs QR */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => openCameraScanner('ocr')}
                className="py-2.5 px-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-2 transition-all"
              >
                <Camera className="w-4 h-4" />
                Escaneo por Foto (OCR)
              </button>
              <button
                type="button"
                onClick={() => openCameraScanner('qr')}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-2 transition-all"
              >
                <QrCode className="w-4 h-4 text-purple-400" />
                Escaneo con Cámara QR
              </button>
            </div>

            {/* Quick Demo Labels */}
            <div className="bg-purple-50/80 p-3 rounded-2xl border border-purple-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-purple-950 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-purple-600" /> Probar con Programación Registrada:
                </span>
                <span className="text-[10px] text-purple-700 font-medium">Haga clic para simular lectura</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {programming.slice(0, 3).map((p: any) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      const demoQR = `FUA|RENAES:${p.renaes}|LOTE:${p.batch_codigo}|CANT:${Math.round(p.cantidad * 0.4)}|DOC:GUIA-PROV-2026-0${p.id}`;
                      setQrInput(demoQR);
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-purple-600 hover:text-white border border-purple-300 text-purple-900 text-[10px] font-bold rounded-lg transition-colors shadow-xs"
                  >
                    🏷️ RENAES {p.renaes} ({p.establishment_nombre})
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Código QR o Texto Extraído por OCR
              </label>
              <textarea
                rows={2}
                placeholder="Escanee QR o ingrese: FUA|RENAES:00001986|LOTE:27|CANT:3000..."
                value={qrInput}
                onChange={e => setQrInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            {/* Resultado de Verificación de Ingreso Total vs Parcial */}
            {qrVerificationResult && (
              <div className={`p-4 rounded-2xl border ${
                qrVerificationResult.success
                  ? qrVerificationResult.isTotal
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm'
                    : 'bg-amber-50 border-amber-300 text-amber-950 shadow-sm'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                {qrVerificationResult.success ? (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {qrVerificationResult.isTotal ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-bold text-sm">{qrVerificationResult.title}</p>
                          <p className="text-[11px] opacity-80">{qrVerificationResult.details}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                        qrVerificationResult.isTotal
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-amber-500 text-white shadow-xs'
                      }`}>
                        {qrVerificationResult.isTotal ? '✅ INGRESO TOTAL (100%)' : '⚠️ INGRESO PARCIAL'}
                      </span>
                    </div>

                    {/* Progress Bar for Programmed Goal */}
                    {qrVerificationResult.cantProgramada > 0 && (
                      <div className="bg-white/80 p-3 rounded-xl border border-slate-200/60 space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span>Avance de Ingreso del Establecimiento:</span>
                          <span>{qrVerificationResult.pct}% ({qrVerificationResult.nuevoTotal.toLocaleString()} de {qrVerificationResult.cantProgramada.toLocaleString()} u.)</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              qrVerificationResult.isTotal ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, qrVerificationResult.pct)}%` }}
                          ></div>
                        </div>
                        <div className="grid grid-cols-4 gap-1 text-[10px] text-center pt-1 font-mono">
                          <div className="bg-slate-100 p-1.5 rounded-lg">
                            <span className="block text-slate-500 text-[9px] uppercase font-sans">Programado</span>
                            <span className="font-bold text-slate-800">{qrVerificationResult.cantProgramada.toLocaleString()}</span>
                          </div>
                          <div className="bg-slate-100 p-1.5 rounded-lg">
                            <span className="block text-slate-500 text-[9px] uppercase font-sans">Anterior</span>
                            <span className="font-bold text-slate-800">{qrVerificationResult.cantPrevio.toLocaleString()}</span>
                          </div>
                          <div className="bg-purple-100 p-1.5 rounded-lg border border-purple-200">
                            <span className="block text-purple-700 text-[9px] uppercase font-sans font-bold">+Ingresando</span>
                            <span className="font-bold text-purple-900">+{qrVerificationResult.cantIngresando.toLocaleString()}</span>
                          </div>
                          <div className={`p-1.5 rounded-lg ${qrVerificationResult.saldoPendiente > 0 ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-emerald-100 text-emerald-900 font-bold'}`}>
                            <span className="block text-[9px] uppercase font-sans">Pendiente</span>
                            <span>{qrVerificationResult.saldoPendiente > 0 ? `${qrVerificationResult.saldoPendiente.toLocaleString()} u.` : '0 u.'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-rose-950">No se encontró coincidencia</p>
                      <p className="text-[11px] text-rose-800 mt-0.5">{qrVerificationResult.error}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Cerrar
              </button>
              <button
                type="button"
                disabled={!qrInput.trim()}
                onClick={() => {
                  const rawText = qrInput.trim();
                  try {
                    let parsed: any = null;
                    if (rawText.startsWith('{')) {
                      parsed = JSON.parse(rawText);
                    } else {
                      const parts = rawText.split('|');
                      parsed = {};
                      parts.forEach(p => {
                        if (p.includes(':')) {
                          const [k, v] = p.split(':');
                          parsed[k.trim().toLowerCase()] = v.trim();
                        } else if (p.trim()) {
                          parsed.tipo = p.trim().toLowerCase();
                        }
                      });
                    }

                    let matchedProg = null;
                    let matchedProd = null;

                    if (parsed.prog_id) {
                      matchedProg = programming.find(p => String(p.id) === String(parsed.prog_id));
                    }
                    if (!matchedProg && parsed.renaes) {
                      matchedProg = programming.find(p => p.renaes && String(p.renaes).toLowerCase() === String(parsed.renaes).toLowerCase() && (!parsed.lote || String(p.batch_codigo).toLowerCase() === String(parsed.lote).toLowerCase()));
                    }
                    if (!matchedProg && parsed.tipo === 'fua' && parsed.lote) {
                      matchedProg = programming.find(p => String(p.batch_codigo).toLowerCase() === String(parsed.lote).toLowerCase());
                    }
                    if (!matchedProg) {
                      const qProd = parsed.codigo || parsed.producto || parsed.tipo || rawText;
                      matchedProd = products.find(p => p.codigo.toLowerCase().includes(String(qProd).toLowerCase()) || p.nombre.toLowerCase().includes(String(qProd).toLowerCase()));
                    }

                    if (matchedProg) {
                      const progRecs = receptions.filter((r: any) => String(r.programming_id) === String(matchedProg.id));
                      let maxEnd = 0;
                      let cantPrevio = matchedProg.cantidad_recibida || 0;
                      for (const pr of progRecs) {
                        if (pr.range_end && pr.range_end > maxEnd) maxEnd = pr.range_end;
                      }
                      const calculatedStart = maxEnd > 0 ? maxEnd + 1 : matchedProg.range_start;
                      const cantProgramada = matchedProg.cantidad || 0;
                      const cantIngresando = parseInt(parsed.cant || parsed.cantidad) || Math.max(1, cantProgramada - cantPrevio);
                      const calculatedEnd = calculatedStart + cantIngresando - 1;
                      const nuevoTotal = cantPrevio + cantIngresando;
                      const saldoPendiente = Math.max(0, cantProgramada - nuevoTotal);
                      const isTotal = nuevoTotal >= cantProgramada;
                      const pct = cantProgramada > 0 ? Math.min(100, Math.round((nuevoTotal / cantProgramada) * 100)) : 100;

                      setRecType('fua');
                      setRecForm({
                        ...recForm,
                        programming_id: String(matchedProg.id),
                        establishment_id: String(matchedProg.establishment_id),
                        batch_id: String(matchedProg.batch_id),
                        supplier_id: String(matchedProg.supplier_id || ''),
                        documento: parsed.doc || parsed.guia || parsed.factura || 'GR-PROV-2026-QR',
                        cantidad_recibida: cantIngresando,
                        range_start: calculatedStart,
                        range_end: calculatedEnd,
                        product_id: ''
                      });

                      setQrVerificationResult({
                        success: true,
                        type: 'FUA',
                        title: `IPRESS: ${matchedProg.establishment_nombre} (RENAES: ${matchedProg.renaes})`,
                        details: `Lote ${matchedProg.batch_codigo} | Guía: ${parsed.doc || parsed.guia || 'GR-PROV-2026'}`,
                        cantProgramada,
                        cantPrevio,
                        cantIngresando,
                        nuevoTotal,
                        saldoPendiente,
                        isTotal,
                        pct
                      });

                      showToast(
                        isTotal
                          ? `✅ ¡Ingreso TOTAL Completo! 100% de la programación de ${matchedProg.establishment_nombre} alcanzado.`
                          : `⚠️ Ingreso PARCIAL: ${cantIngresando.toLocaleString()} u. ingresadas (${pct}% del total programado).`,
                        'success'
                      );
                    } else if (matchedProd) {
                      const qty = parseInt(parsed.cant || parsed.cantidad) || 50;
                      setRecType('demanda');
                      setRecForm({
                        ...recForm,
                        programming_id: '',
                        product_id: String(matchedProd.id),
                        establishment_id: '',
                        documento: parsed.doc || parsed.guia || parsed.factura || 'GR-PROV-2026-QR',
                        cantidad_recibida: qty
                      });

                      setQrVerificationResult({
                        success: true,
                        type: 'DEMANDA',
                        title: `${matchedProd.nombre} (${matchedProd.codigo})`,
                        details: `Ingreso a Demanda | Cantidad: ${qty} ${matchedProd.unidad_control}`,
                        cantProgramada: qty,
                        cantPrevio: 0,
                        cantIngresando: qty,
                        nuevoTotal: qty,
                        saldoPendiente: 0,
                        isTotal: true,
                        pct: 100
                      });
                      showToast(`✅ QR verificado: ${matchedProd.nombre} autocompletado`);
                    } else {
                      setQrVerificationResult({
                        success: false,
                        error: `No se encontró ningún establecimiento ni programación activa para el código: "${rawText}"`
                      });
                    }
                  } catch (err: any) {
                    showToast('Error al procesar la lectura o código de verificación', 'error');
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow"
              >
                <Check className="w-4 h-4" /> Verificar Ingreso Total / Parcial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Personnel Modal */}
      {showPersModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{persForm.id ? 'Editar Personal Receptor' : 'Registrar Personal Receptor'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const res = await fetch('/api/personnel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...persForm, username: currentUser.username })
              });
              if (res.ok) {
                showToast('Personal guardado exitosamente');
                setShowPersModal(false);
                loadData();
              } else {
                const err = await res.json();
                showToast(err.error || 'Error al guardar personal', 'error');
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">DNI (8 dígitos)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={persForm.dni}
                    onChange={e => setPersForm({ ...persForm, dni: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono"
                    placeholder="12345678"
                  />
                  <button
                    type="button"
                    disabled={isSearchingDNI || persForm.dni.length !== 8}
                    onClick={async () => {
                      setIsSearchingDNI(true);
                      try {
                        const res = await fetch(`/api/external/dni/${persForm.dni}`);
                        const data = await res.json();
                        if (res.ok && data.success) {
                          setPersForm({
                            ...persForm,
                            nombres: data.nombres || '',
                            apellidos: data.apellidos || ''
                          });
                          showToast('✅ DNI consultado exitosamente en API Perú');
                        } else {
                          showToast(data.error || 'DNI no encontrado', 'error');
                        }
                      } catch (err: any) {
                        showToast('Error al consultar DNI', 'error');
                      } finally {
                        setIsSearchingDNI(false);
                      }
                    }}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs whitespace-nowrap shadow transition-colors flex items-center gap-1"
                  >
                    {isSearchingDNI ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    Consultar API Perú
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Nombres</label>
                <input
                  type="text"
                  required
                  value={persForm.nombres}
                  onChange={e => setPersForm({ ...persForm, nombres: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                  placeholder="Rosa María"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Apellidos</label>
                <input
                  type="text"
                  required
                  value={persForm.apellidos}
                  onChange={e => setPersForm({ ...persForm, apellidos: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                  placeholder="Valdiviezo Silva"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowPersModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow">Guardar Personal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Establishment Modal */}
      {showEstModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{estForm.id ? 'Editar Establecimiento' : 'Nuevo Establecimiento'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const res = await fetch('/api/establishments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...estForm, username: currentUser.username })
              });
              if (res.ok) {
                showToast('Establecimiento guardado exitosamente');
                setShowEstModal(false);
                loadData();
              } else {
                const err = await res.json();
                showToast(err.error || 'Error al guardar', 'error');
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Código RENAES (con ceros)</label>
                <input
                  type="text"
                  required
                  value={estForm.renaes}
                  onChange={e => setEstForm({ ...estForm, renaes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono"
                  placeholder="00001"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Nombre del Establecimiento</label>
                <input
                  type="text"
                  required
                  value={estForm.nombre}
                  onChange={e => setEstForm({ ...estForm, nombre: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                  placeholder="C.S. TAMBOGRANDE"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="estActivo"
                  checked={estForm.activo === 1}
                  onChange={e => setEstForm({ ...estForm, activo: e.target.checked ? 1 : 0 })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="estActivo" className="text-xs font-medium text-slate-700">Establecimiento Activo</label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowEstModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{batchForm.id ? 'Editar Lote' : 'Nuevo Lote'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const res = await fetch('/api/batches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...batchForm, username: currentUser.username })
              });
              if (res.ok) {
                showToast('Lote guardado exitosamente');
                setShowBatchModal(false);
                loadData();
              } else {
                const err = await res.json();
                showToast(err.error || 'Error al guardar', 'error');
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Código de Lote</label>
                <input
                  type="text"
                  required
                  value={batchForm.codigo}
                  onChange={e => setBatchForm({ ...batchForm, codigo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono"
                  placeholder="27 o 27A"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Descripción</label>
                <input
                  type="text"
                  required
                  value={batchForm.descripcion}
                  onChange={e => setBatchForm({ ...batchForm, descripcion: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                  placeholder="Lote Nacional 2026-I"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Año de Referencia</label>
                <input
                  type="number"
                  required
                  value={batchForm.anio}
                  onChange={e => setBatchForm({ ...batchForm, anio: parseInt(e.target.value) || 2026 })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="batchActivo"
                  checked={batchForm.activo === 1}
                  onChange={e => setBatchForm({ ...batchForm, activo: e.target.checked ? 1 : 0 })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="batchActivo" className="text-xs font-medium text-slate-700">Lote Habilitado</label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowBatchModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Modal */}
      {showSupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{supForm.id ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const res = await fetch('/api/suppliers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...supForm, username: currentUser.username })
              });
              if (res.ok) {
                showToast('Proveedor guardado exitosamente');
                setShowSupModal(false);
                loadData();
              } else {
                const err = await res.json();
                showToast(err.error || 'Error al guardar', 'error');
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">RUC</label>
                <input
                  type="text"
                  maxLength={11}
                  value={supForm.ruc}
                  onChange={e => setSupForm({ ...supForm, ruc: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono"
                  placeholder="20123456789"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Razón Social</label>
                <input
                  type="text"
                  required
                  value={supForm.nombre}
                  onChange={e => setSupForm({ ...supForm, nombre: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                  placeholder="GRAFICA NACIONAL S.A.C."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Persona de Contacto</label>
                <input
                  type="text"
                  value={supForm.contacto}
                  onChange={e => setSupForm({ ...supForm, contacto: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Teléfono</label>
                <input
                  type="text"
                  value={supForm.telefono}
                  onChange={e => setSupForm({ ...supForm, telefono: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowSupModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{userForm.id ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...userForm, admin_username: currentUser.username })
              });
              if (res.ok) {
                showToast('Usuario guardado exitosamente');
                setShowUserModal(false);
                loadData();
              } else {
                const err = await res.json();
                showToast(err.error || 'Error al guardar usuario', 'error');
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Usuario</label>
                <input
                  type="text"
                  required
                  value={userForm.username}
                  onChange={e => setUserForm({ ...userForm, username: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Contraseña {userForm.id && '(Dejar en blanco para mantener)'}</label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={userForm.nombre_completo}
                  onChange={e => setUserForm({ ...userForm, nombre_completo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Rol</label>
                <select
                  value={userForm.role}
                  onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                >
                  <option value="user">Operador (Usuario)</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Establishment History / Traceability Modal */}
      {showHistoryModal && selectedEstHistory && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Historial y Trazabilidad por IPRESS</h3>
                <p className="text-sm font-semibold text-blue-600 mt-1">
                  {selectedEstHistory.establishment.nombre} (RENAES: {selectedEstHistory.establishment.renaes})
                </p>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" /> Recepciones Registradas ({selectedEstHistory.receptions.length})
                </h4>
                {selectedEstHistory.receptions.length === 0 ? (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-4 rounded-xl">No registra recepciones físicas en almacén.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase">
                          <th className="p-2.5">Fecha</th>
                          <th className="p-2.5">Documento</th>
                          <th className="p-2.5">Lote / Rango</th>
                          <th className="p-2.5">Cantidad</th>
                          <th className="p-2.5">Proveedor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedEstHistory.receptions.map((r: any) => (
                          <tr key={r.id}>
                            <td className="p-2.5 text-slate-600">{r.fecha_recepcion}</td>
                            <td className="p-2.5 font-mono font-bold text-blue-600">{r.documento}</td>
                            <td className="p-2.5 font-mono text-slate-800">{r.range_start ? `Lote ${r.batch_codigo} (${r.range_start}-${r.range_end})` : `Lote ${r.batch_codigo || 'N/A'}`}</td>
                            <td className="p-2.5 font-bold">{r.cantidad_recibida}</td>
                            <td className="p-2.5 text-slate-600">{r.supplier_nombre || 'Impresión Propia'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-indigo-600" /> Entregas Realizadas a la IPRESS ({selectedEstHistory.deliveries.length})
                </h4>
                {selectedEstHistory.deliveries.length === 0 ? (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-4 rounded-xl">No registra entregas de formatos a esta IPRESS.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedEstHistory.deliveries.map((d: any) => (
                      <div key={d.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-mono font-bold text-blue-600 text-xs">{d.numero_comprobante}</span>
                          <span className="text-xs text-slate-500">{d.fecha_entrega} • Receptor DNI: {d.receptor_dni} ({d.receptor_nombre})</span>
                        </div>
                        <div className="text-xs space-y-1">
                          {d.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-slate-700 bg-white p-2 rounded border border-slate-100">
                              <span>{item.product_nombre}</span>
                              <span className="font-mono font-semibold">{item.range_start ? `Rango: ${item.range_start}-${item.range_end}` : `Cant: ${item.cantidad}`}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package & OCR Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-purple-600" />
                  {packageModalMode === 'create' ? 'Registrar Nuevo Paquete & Escaneo OCR' : `Ficha del Paquete ${selectedPackage?.codigo_paquete || ''}`}
                </h3>
                <p className="text-xs text-slate-500">
                  {packageModalMode === 'create' 
                    ? 'Escanee la etiqueta del proveedor o complete la información de la IPRESS y correlativos.'
                    : 'Consulte el saldo, ubicación, código QR e historial de movimientos del paquete.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPackageModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {packageModalMode === 'create' ? (
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await fetch('/api/warehouse/packages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      ...packageForm,
                      user_id: currentUser.id,
                      username: currentUser.username
                    })
                  });
                  const data = await res.json();
                  if (res.ok) {
                    showToast(`✅ Paquete ${data.codigo_paquete} registrado exitosamente en almacén`);
                    setShowPackageModal(false);
                    loadData();
                  } else {
                    showToast(data.error || 'Error al registrar paquete', 'error');
                  }
                } catch (err: any) {
                  showToast('Error de conexión al guardar el paquete', 'error');
                }
              }} className="space-y-4">
                
                {/* OCR Escaneo Box */}
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-purple-600" /> Escanear o Fotografiar Etiqueta (OCR)
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                      {/* Botón 1: Cámara del dispositivo */}
                      <button
                        type="button"
                        onClick={() => openCameraScanner('ocr')}
                        className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg text-xs shadow flex items-center gap-1.5 transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Tomar Foto (Cámara)
                      </button>

                      {/* Botón 2: Cargar Archivo de Imagen */}
                      <label className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold rounded-lg text-xs cursor-pointer flex items-center gap-1.5 border border-purple-300 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-purple-700" />
                        Subir Imagen
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleFileUploadOCR}
                          className="hidden"
                        />
                      </label>

                      {/* Botón 3: Ejemplo Demo */}
                      <button
                        type="button"
                        disabled={isScanningOCR}
                        onClick={async () => {
                          setIsScanningOCR(true);
                          try {
                            const res = await fetch('/api/warehouse/packages/ocr', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ image: 'demo_label_image_data' })
                            });
                            const data = await res.json();
                            if (res.ok && data.extracted) {
                              const ext = data.extracted;
                              const matchedEst = establishments.find(e => e.renaes && String(e.renaes).padStart(8, '0') === String(ext.renaes).padStart(8, '0'));
                              setPackageForm({
                                ...packageForm,
                                establishment_id: matchedEst ? String(matchedEst.id) : '',
                                cantidad_inicial: ext.cantidad || 3000,
                                range_start: ext.range_start || '00001',
                                range_end: ext.range_end || '03000',
                                numero_paquete: ext.numero_paquete || '01/01',
                                ocr_raw_text: ext.ocr_raw_text || ''
                              });
                              showToast(`✅ OCR procesado: RENAES ${ext.renaes} (${ext.nombre_ipress}) reconocido.`);
                            }
                          } catch (err) {
                            showToast('Error al procesar lectura de etiqueta OCR', 'error');
                          } finally {
                            setIsScanningOCR(false);
                          }
                        }}
                        className="px-2.5 py-1.5 bg-white hover:bg-purple-100 text-purple-800 font-medium rounded-lg text-xs border border-purple-200 shadow-sm flex items-center gap-1.5"
                      >
                        {isScanningOCR ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                        Ejemplo Demo
                      </button>
                    </div>
                  </div>

                  {/* Previsualizaciones del OCR */}
                  {packageForm.foto_etiqueta && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-purple-200 shadow-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={packageForm.foto_etiqueta}
                          alt="Foto Etiqueta Capturada"
                          className="w-16 h-16 object-cover rounded-lg border border-purple-200 shadow-xs"
                        />
                        <div className="text-[11px]">
                          <p className="font-bold text-purple-950">Fotografía de la Etiqueta Adjunta</p>
                          <p className="text-slate-500">Imagen guardada para expediente e inspección física.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          disabled={isScanningOCR}
                          onClick={() => processOCRWithBase64(packageForm.foto_etiqueta)}
                          className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-lg text-xs shadow flex items-center gap-1.5 transition-all"
                        >
                          {isScanningOCR ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <QrCode className="w-3.5 h-3.5" />}
                          ⚡ Analizar y Extraer Datos (OCR IA)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPackageForm({ ...packageForm, foto_etiqueta: '' })}
                          className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition-colors"
                        >
                          Quitar Foto
                        </button>
                      </div>
                    </div>
                  )}

                  {packageForm.ocr_raw_text && (
                    <div className="bg-white p-2.5 rounded-lg border border-purple-200 text-[10px] font-mono text-purple-900 leading-relaxed">
                      <p className="font-bold text-purple-950 mb-0.5">Texto Extraído por OCR:</p>
                      <pre className="whitespace-pre-wrap">{packageForm.ocr_raw_text}</pre>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Producto / Formato del Catálogo
                  </label>
                  <select
                    required
                    value={packageForm.product_id}
                    onChange={e => setPackageForm({ ...packageForm, product_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
                  >
                    <option value="">-- Seleccione un Formato --</option>
                    {products.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} ({p.codigo}) - {p.tipo === 'fua' ? 'Por Rangos FUA' : 'Bajo Demanda'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Establecimiento de Salud (IPRESS)
                  </label>
                  <SearchableEstablishmentSelect
                    establishments={establishments}
                    value={packageForm.establishment_id}
                    onChange={val => setPackageForm({ ...packageForm, establishment_id: val })}
                    placeholder="Buscar IPRESS por RENAES (ej. 00001986) o Nombre..."
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Cantidad Inicial</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={packageForm.cantidad_inicial}
                      onChange={e => setPackageForm({ ...packageForm, cantidad_inicial: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Lote</label>
                    <select
                      value={packageForm.batch_id}
                      onChange={e => setPackageForm({ ...packageForm, batch_id: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
                    >
                      <option value="">Sin lote específico</option>
                      {batches.map((b: any) => (
                        <option key={b.id} value={b.id}>Lote {b.codigo}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">N.º Paquete</label>
                    <input
                      type="text"
                      placeholder="01/01"
                      value={packageForm.numero_paquete}
                      onChange={e => setPackageForm({ ...packageForm, numero_paquete: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Correlativo Inicio</label>
                    <input
                      type="text"
                      placeholder="00001"
                      value={packageForm.range_start}
                      onChange={e => setPackageForm({ ...packageForm, range_start: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Correlativo Fin</label>
                    <input
                      type="text"
                      placeholder="03000"
                      value={packageForm.range_end}
                      onChange={e => setPackageForm({ ...packageForm, range_end: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Ubicación Física en Almacén</label>
                  <input
                    type="text"
                    value={packageForm.ubicacion_almacen}
                    onChange={e => setPackageForm({ ...packageForm, ubicacion_almacen: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowPackageModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs shadow"
                  >
                    Guardar Paquete & Generar QR
                  </button>
                </div>
              </form>
            ) : selectedPackage ? (
              <div className="space-y-4">
                {/* QR Display Card */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                  <div className="bg-white p-3 rounded-xl border border-slate-300 shadow-sm flex flex-col items-center">
                    <div className="w-32 h-32 bg-white flex items-center justify-center border-2 border-slate-900 rounded-lg p-1">
                      <QrCode className="w-24 h-24 text-slate-900" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-purple-700 mt-2">
                      {selectedPackage.codigo_paquete}
                    </span>
                  </div>

                  <div className="flex-1 space-y-1.5 text-xs">
                    <p className="font-extrabold text-sm text-slate-900">{selectedPackage.product_nombre}</p>
                    <p className="text-slate-600 font-medium">
                      IPRESS: <span className="font-bold text-slate-900">{selectedPackage.establishment_nombre || 'Almacén Central'}</span>
                    </p>
                    <p className="font-mono text-slate-700">RENAES: <span className="font-bold">{selectedPackage.renaes || '00000000'}</span></p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-mono font-bold text-[11px]">
                        Saldo: {selectedPackage.saldo?.toLocaleString() || 0} u.
                      </span>
                      {selectedPackage.range_start && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[11px]">
                          Rangos: {selectedPackage.range_start} - {selectedPackage.range_end}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1">Ubicación: {selectedPackage.ubicacion_almacen}</p>
                  </div>
                </div>

                {/* Move / Deliver partial form inside package view */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-purple-600" /> Registrar Entrega / Salida de este Paquete
                  </h4>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as any;
                    const qty = parseInt(form.deliveryQty.value) || 0;
                    const dni = form.receptorDni.value;
                    const name = form.receptorName.value;
                    if (qty <= 0 || qty > selectedPackage.saldo) {
                      showToast(`La cantidad debe ser mayor a 0 y no superar el saldo (${selectedPackage.saldo})`, 'error');
                      return;
                    }
                    try {
                      const res = await fetch(`/api/warehouse/packages/${selectedPackage.id}/movement`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          tipo: 'entrega',
                          cantidad: qty,
                          receptor_dni: dni,
                          receptor_nombre: name,
                          user_id: currentUser.id,
                          username: currentUser.username
                        })
                      });
                      if (res.ok) {
                        showToast(`✅ Entrega de ${qty} u. realizada desde paquete ${selectedPackage.codigo_paquete}`);
                        setShowPackageModal(false);
                        loadData();
                      } else {
                        const err = await res.json();
                        showToast(err.error || 'Error al procesar movimiento', 'error');
                      }
                    } catch (err) {
                      showToast('Error de conexión', 'error');
                    }
                  }} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cant. Entregar</label>
                        <input
                          type="number"
                          name="deliveryQty"
                          required
                          min="1"
                          max={selectedPackage.saldo}
                          defaultValue={selectedPackage.saldo}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">DNI Receptor</label>
                        <input
                          type="text"
                          name="receptorDni"
                          required
                          maxLength={8}
                          placeholder="8 dígitos"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nombre Receptor</label>
                        <input
                          type="text"
                          name="receptorName"
                          required
                          placeholder="Nombres y Apellidos"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" /> Imprimir Etiqueta QR
                      </button>
                      <button
                        type="submit"
                        disabled={selectedPackage.saldo <= 0}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow"
                      >
                        Confirmar Salida de Paquete
                      </button>
                    </div>
                  </form>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowPackageModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProdModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{prodForm.id ? 'Editar Formato / Producto' : 'Nuevo Formato / Producto'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...prodForm, username: currentUser.username })
              });
              if (res.ok) {
                showToast('Formato guardado exitosamente');
                setShowProdModal(false);
                loadData();
              } else {
                const err = await res.json();
                showToast(err.error || 'Error al guardar formato', 'error');
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Código</label>
                <input
                  type="text"
                  required
                  value={prodForm.codigo}
                  onChange={e => setProdForm({ ...prodForm, codigo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono"
                  placeholder="HIS-02"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Nombre del Formato</label>
                <input
                  type="text"
                  required
                  value={prodForm.nombre}
                  onChange={e => setProdForm({ ...prodForm, nombre: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                  placeholder="Hoja HIS Adicional"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Tipo de Control</label>
                <select
                  value={prodForm.tipo}
                  onChange={e => setProdForm({ ...prodForm, tipo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                >
                  <option value="fua">FUA (Por Rangos RENAES)</option>
                  <option value="otro">Bajo Demanda (Por Stock / Cantidad Total)</option>
                </select>
              </div>

              {prodForm.tipo === 'otro' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Stock Total Inicial</label>
                    <input
                      type="number"
                      min="0"
                      value={prodForm.stock_total}
                      onChange={e => setProdForm({ ...prodForm, stock_total: parseInt(e.target.value) || 0, stock_disponible: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Unidad Control</label>
                    <input
                      type="text"
                      value={prodForm.unidad_control}
                      onChange={e => setProdForm({ ...prodForm, unidad_control: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800"
                      placeholder="blocks"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowProdModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow">Guardar Formato</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Live Camera Scanner Modal */}
      {showCameraScannerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {cameraScannerTarget === 'ocr' ? 'Cámara de Lectura de Etiquetas (OCR)' : 'Escáner de Código QR'}
                  </h3>
                  <p className="text-xs text-slate-400">Enfoque la etiqueta física o el código QR en el recuadro</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCameraScanner}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cameraError ? (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-center space-y-3">
                <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
                <p className="text-xs text-rose-200">{cameraError}</p>
                <div className="pt-2 flex justify-center gap-2">
                  <label className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl cursor-pointer shadow">
                    Subir Fotografía desde Archivo
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => {
                        closeCameraScanner();
                        handleFileUploadOCR(e);
                      }}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => openCameraScanner(cameraScannerTarget)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl"
                  >
                    Reintentar Cámara
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner min-h-[260px] flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover"
                />
                
                {/* Visual Scanner Overlay */}
                <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-purple-400/60 m-8 rounded-xl flex items-center justify-center">
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse shadow-lg"></div>
                </div>

                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-mono text-purple-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Transmisión en Vivo Encontrada
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={closeCameraScanner}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
              
              {!cameraError && (
                <button
                  type="button"
                  disabled={isCapturingCamera}
                  onClick={captureCameraPhoto}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-2"
                >
                  {isCapturingCamera ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  Capturar y Procesar Imagen
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
