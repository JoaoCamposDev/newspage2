import './catalogo.css';
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import api from '../../services/api';
import Slider from "react-slick"; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

function PageCatalogo() {
    const { id } = useParams();
    const [artigos, setArtigos] = useState([]);
    const [artigoSelecionado, setArtigoSelecionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Função para buscar todos os artigos
    const fetchArticles = async () => {
        console.log("Buscando artigos..."); // Log para verificar a chamada
        try {
            const resposta = await api.get("/articles");
            console.log("Resposta da API:", resposta.data); // Verifique a resposta completa
            if (Array.isArray(resposta.data)) {
                setArtigos(resposta.data);
                console.log("Artigos carregados:", resposta.data); // Log para verificar os artigos carregados
            } else {
                setError("Formato de resposta inválido."); // Verifique se não é um array
            }
        } catch (err) {
            setError("Erro ao carregar os artigos.");
            console.error("Erro ao buscar artigos:", err);
        } finally {
            setLoading(false);
        }
    };

    // Função para buscar um artigo específico pelo ID
    const fetchArticleById = async (articleId) => {
        try {
            const resposta = await api.get(`/articles/${articleId}`);
            if (resposta.data.article && resposta.data.article.length > 0) {
                setArtigoSelecionado(resposta.data.article[0]);
            } else {
                setError("Artigo não encontrado.");
            }
        } catch (err) {
            setError("Erro ao carregar o artigo.");
            console.error("Erro ao buscar artigo:", err);
        } finally {
            setLoading(false);
        }
    };

    // Efeito para buscar artigos ao carregar o componente
    useEffect(() => {
        console.log("Componente montado, id:", id); // Log para verificar o ID
        if (id) {
            fetchArticleById(id); // Busca o artigo selecionado
            fetchArticles(); // Busca todos os artigos ao acessar a página do artigo
        } else {
            fetchArticles(); // Se não houver ID, busca todos os artigos
        }
    }, [id]);

    // Função para formatar a data
    const formatarData = (data) => {
        const opcoes = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(data).toLocaleDateString('pt-BR', opcoes);
    };

    // Função para formatar o conteúdo
    const formatarConteudo = (conteudo) => {
        return conteudo
            .replace(/\n/g, '<br />')
            .replace(/<strong>(.*?)<\/strong>/g, '<strong class="bold-highlight">$1</strong>');
    };

    // Configurações do carrossel
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    // Verificações de loading e error
    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='container-catalogo'>
            <div className='container-logo'>
                <Link to="/">
                    <img className='img-logo-pag-artigo' src='/img/logo-pag-artigo.svg' alt='logo' />
                </Link>
            </div>
            <div className='container-navbar'>
                <Link to="/">SOBRE</Link>
                <Link to="/horariocoleta">HORÁRIOS DAS COLETAS</Link>
                <Link to="/catalogo">ARTIGOS</Link>
                <Link to="/">ECOPONTOS</Link>
            </div>
            <div className='btn-login'>
                <Link className="button" to="/Login">ADMIN</Link>
            </div>

            {/* Renderizando a notícia selecionada */}
            {artigoSelecionado && (
                <div className='container-not'>
                    <div className='div-voltar-home'>
                        <Link to={'/'} className='voltar-home'>Voltar</Link>
                    </div>
                    <div className='container-titulo'>
                        <h5 className='data'>{formatarData(artigoSelecionado.date_article)}</h5>
                        <h2 className='titulo'>{artigoSelecionado.title_article}</h2>
                        <h5 className='fonte'>{artigoSelecionado.reference_article}</h5>
                    </div>
                    <img className='img-not-art' src={artigoSelecionado.image_article} alt='img' />
                    <p dangerouslySetInnerHTML={{ __html: formatarConteudo(artigoSelecionado.description_article) }}></p>
                </div>
            )}

            {/* Carrossel de Mais Notícias */}
            <div className='container-carrossel'>
                <h2><span className='highlight'>Mais</span> Notícias</h2>
                {artigos.length > 0 ? (
                    <Slider {...settings}>
                    {artigos.slice(0, 5).map((artigo) => (
                        <div className='container-artigo' key={artigo.pk_IDarticle}>
                            <Link to={`/catalogo/${artigo.pk_IDarticle}`}>
                                <img src={artigo.image_article} alt={artigo.title_article} className='img-artigo' />
                                <h5 className='titulo'>{artigo.title_article}</h5>
                                <p className='data'>{formatarData(artigo.date_article)}</p>
                            </Link>
                        </div>
                    ))}
                </Slider>
                ) : (
                    <p>Nenhum artigo disponível.</p> // Mensagem se não houver artigos
                )}
            </div>

            <div className='container-footer'>
                <img src="/img/logo-v2.svg" alt="logo" className='logo-verdois' />
                <p>Seu guia para um futuro <br /> mais verde.</p>
                <a href="#top" className='botao-voltar'>
                    <img className='img-voltar-cat' src='/img/btn-voltar.svg' alt='Voltar ao topo' />
                </a>
                <div className='container-footer-btn'>
                    <Link to="/horariocoleta">ARTIGOS</Link>
                    <Link to="/funcionalidades">SOBRE</Link>
                </div>
                <div className='container-linha'>
                    <img src="/img/line-footer.svg" alt="linha" className='linha-footer'/>
                    <p>Copyright © 2024 | ECOGUIA | by ECO12BIOTEC</p>
                </div>
            </div>
        </div>
    );
}

export default PageCatalogo;