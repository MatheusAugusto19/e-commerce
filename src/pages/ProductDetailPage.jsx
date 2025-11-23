import React, { useState } from "react";
import { useCart } from "../context/useCart";
import { useNotification } from "../context/useNotification";
import ReviewSection from "../components/ReviewSection";
import "./ProductDetailPage.scss";

export default function ProductDetailPage({ productId, onClose }) {
  const { addToCart } = useCart();
  const { addNotification } = useNotification();
  const [quantity, setQuantity] = useState(1);

  // Dados de exemplo - depois você vai buscar do backend
  const products = {
    1: {
      id: 1,
      name: "Fone de Ouvido Bluetooth",
      price: 299.99,
      image: "https://via.placeholder.com/500x400?text=Fone+Bluetooth",
      rating: 4.5,
      reviews: 125,
      description:
        "Fone de ouvido premium com cancelamento de ruído ativo (ANC) de última geração. Oferece conforto excepcional com almofadas de espuma de memória e design ergonômico.",
      features: [
        "Cancelamento de ruído ativo (ANC)",
        "Bateria de 30 horas",
        "Bluetooth 5.0",
        "Carregamento rápido (10 min = 5 horas)",
        "À prova de água IPX4",
        "Modo transparência",
        "Microfone duplo com IA",
      ],
      specifications: {
        brand: "TechAudio Pro",
        model: "TAP-2024",
        warranty: "2 anos",
        color: "Preto",
        weight: "250g",
        batteryLife: "30 horas",
        connectivity: "Bluetooth 5.0, 3.5mm",
      },
      inStock: true,
      stock: 15,
    },
    2: {
      id: 2,
      name: "Câmera Web HD",
      price: 199.99,
      image: "https://via.placeholder.com/500x400?text=Camera+Web",
      rating: 4.2,
      reviews: 89,
      description:
        "Câmera web 1080p Full HD com autofoco automático e luz infravermelha ajustável. Ideal para videoconferências, streams e gravações.",
      features: [
        "Resolução 1080p Full HD",
        "Sensor CMOS de alta sensibilidade",
        "Autofoco automático",
        "Campo de visão 90°",
        "Microfone integrado com cancelamento de ruído",
        "Suporte para ângulos ajustáveis",
        "Compatível com Windows, Mac e Linux",
      ],
      specifications: {
        brand: "ProVision",
        model: "PV-1080",
        warranty: "1 ano",
        resolution: "1080p",
        framerate: "30fps",
        interface: "USB 2.0",
        cableLenght: "2m",
      },
      inStock: true,
      stock: 8,
    },
    3: {
      id: 3,
      name: "Mouse Wireless",
      price: 89.99,
      image: "https://via.placeholder.com/500x400?text=Mouse+Wireless",
      rating: 4.8,
      reviews: 203,
      description:
        "Mouse sem fio ultracompacto com bateria de longa duração. Perfeito para trabalho produtivo com precisão alta e resposta rápida.",
      features: [
        "Bateria de longa duração (12 meses)",
        "Sensor óptico de 1200 DPI",
        "Conexão sem fio estável 2.4GHz",
        "Design ergonômico e compacto",
        "3 botões + scroll",
        "Compatível com Windows e Mac",
        "Modo sleep automático",
      ],
      specifications: {
        brand: "MicroPrecision",
        model: "MP-2000",
        warranty: "1 ano",
        dpi: "1200",
        batteryLife: "12 meses",
        weight: "95g",
        color: "Cinza",
      },
      inStock: true,
      stock: 25,
    },
    4: {
      id: 4,
      name: "Teclado Mecânico RGB",
      price: 449.99,
      image: "https://via.placeholder.com/500x400?text=Teclado+Mecanico",
      rating: 4.6,
      reviews: 156,
      description:
        "Teclado mecânico premium com iluminação RGB personalizável. Cada tecla é precisamente posicionada para experiência de digitação máxima.",
      features: [
        "Switches mecânicos Red Hot",
        "Iluminação RGB por tecla",
        "Layout 104 teclas",
        "Estrutura de alumínio",
        "Macro programmable",
        "Software de customização",
        "Suporte para ângulo de digitação",
      ],
      specifications: {
        brand: "MechanicalPro",
        model: "MP-RGB-2024",
        warranty: "3 anos",
        switchType: "Red Hot Mechanical",
        backlighting: "RGB Full",
        connectionType: "USB-C (com fio)",
        weight: "1.2kg",
      },
      inStock: true,
      stock: 12,
    },
    5: {
      id: 5,
      name: "Monitor 27\" 4K",
      price: 1299.99,
      image: "https://via.placeholder.com/500x400?text=Monitor+4K",
      rating: 4.7,
      reviews: 98,
      description:
        "Monitor Ultra HD 4K com taxa de atualização de 60Hz. Cores vibrantes e contraste profundo para profissionais de design e criação.",
      features: [
        "Resolução 4K UHD (3840x2160)",
        "Taxa de atualização 60Hz",
        "Painel IPS - 99% sRGB",
        "1 bilhão de cores",
        "Tempo de resposta 5ms",
        "Suporte HDMI 2.0 e DisplayPort",
        "Contraste 1000:1",
      ],
      specifications: {
        brand: "ScreenMaster",
        model: "SM-4K27",
        warranty: "2 anos",
        panelType: "IPS",
        refreshRate: "60Hz",
        response: "5ms",
        colorGamut: "99% sRGB",
      },
      inStock: true,
      stock: 5,
    },
    6: {
      id: 6,
      name: "Mousepad Grande",
      price: 79.99,
      image: "https://via.placeholder.com/500x400?text=Mousepad",
      rating: 4.3,
      reviews: 67,
      description:
        "Mousepad XXL com superfície de tecido premium. Ideal para setup gamer ou profissional com mucho espaço para mouse e teclado.",
      features: [
        "Tamanho XXL: 900x400x3mm",
        "Superfície de tecido premium",
        "Base de borracha antideslizante",
        "Bordas costuradas reforçadas",
        "Fácil de limpar",
        "Design moderno e elegante",
        "Compatível com qualquer mouse",
      ],
      specifications: {
        brand: "ProPad",
        model: "PP-XXL-900",
        warranty: "1 ano",
        size: "900x400x3mm",
        material: "Tecido premium",
        baseType: "Borracha antideslizante",
        color: "Preto",
      },
      inStock: true,
      stock: 30,
    },
  };

  const product = products[productId];

  if (!product) {
    return (
      <div className="product-detail-modal">
        <div className="modal-overlay" onClick={onClose}></div>
        <div className="modal-content">
          <button onClick={onClose} className="close-btn">✕</button>
          <p>Produto não encontrado</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert(`${quantity} ${quantity > 1 ? "unidades" : "unidade"} de ${product.name} adicionado(a) ao carrinho!`);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="product-detail-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <button onClick={onClose} className="close-btn">✕</button>

        <div className="product-detail-container">
          {/* Imagem */}
          <div className="detail-image-section">
            <img src={product.image} alt={product.name} className="detail-image" />
            <div className="stock-badge">
              {product.inStock ? "Em Estoque" : "Fora de Estoque"}
            </div>
          </div>

          {/* Informações */}
          <div className="detail-info-section">
            <h1 className="detail-name">{product.name}</h1>

            {/* Rating */}
            <div className="detail-rating">
              <span className="stars">⭐ {product.rating.toFixed(1)}</span>
              <span className="reviews">({product.reviews} avaliações)</span>
            </div>

            {/* Preço */}
            <div className="detail-price">
              <span className="price">R$ {product.price.toFixed(2)}</span>
              <span className="original-price">R$ {(product.price * 1.2).toFixed(2)}</span>
            </div>

            {/* Descrição */}
            <p className="detail-description">{product.description}</p>

            {/* Features */}
            <div className="detail-features">
              <h3>Principais Características</h3>
              <ul>
                {product.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>
            </div>

            {/* Quantidade e Carrinho */}
            <div className="detail-actions">
              <div className="quantity-selector">
                <button onClick={decreaseQuantity} className="qty-btn">−</button>
                <span className="qty-display">{quantity}</span>
                <button onClick={increaseQuantity} className="qty-btn">+</button>
                <span className="stock-info">({product.stock} disponíveis)</span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="add-to-cart-large"
              >
                🛒 Adicionar ao Carrinho
              </button>
            </div>

            {/* Especificações */}
            <div className="detail-specs">
              <h3>Especificações</h3>
              <table className="specs-table">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key}>
                      <td className="spec-label">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </td>
                      <td className="spec-value">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Reviews */}
            <ReviewSection productId={productId} />
          </div>
        </div>
      </div>
    </div>
  );
}
