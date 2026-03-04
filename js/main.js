document.addEventListener('DOMContentLoaded', function () {
    // Configuração inicial
    const CONFIG = {
        whatsapp: {
            number: '5583986711188',
            defaultMessage: 'Olá, gostaria de um orçamento.'
        },
        modal: {
            transitionTime: 300,
            maxWidth: 'min(1200px, 85vw)',
            maxHeight: '80vh'
        }
    };

    // Elementos DOM
    const elements = {
        nav: {
            toggle: document.getElementById('menuToggle'),
            menu: document.getElementById('navMenu')
        },
        whatsapp: {
            hero: document.getElementById('whatsappHero'),
            link: document.getElementById('waLink')
        },
        modal: {
            container: document.getElementById('imageModal'),
            image: document.getElementById('modalImg'),
            caption: document.getElementById('modalCaption'),
            close: document.querySelector('.modal-close')
        },
        year: document.getElementById('year')
    };

    // === Funções utilitárias ===
    function createWhatsAppUrl(text) {
        return `https://api.whatsapp.com/send?phone=${CONFIG.whatsapp.number}&text=${encodeURIComponent(text)}`;
    }

    // === Navegação Mobile ===
    if (elements.nav.toggle && elements.nav.menu) {
        elements.nav.toggle.addEventListener('click', () => {
            elements.nav.toggle.classList.toggle('active');
            elements.nav.menu.classList.toggle('active');
            document.body.style.overflow = elements.nav.menu.classList.contains('active') ? 'hidden' : '';
        });

        elements.nav.menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                elements.nav.toggle.classList.remove('active');
                elements.nav.menu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.nav.menu.classList.contains('active')) {
                elements.nav.toggle.classList.remove('active');
                elements.nav.menu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // === WhatsApp ===
    function setupWhatsAppLinks() {
        if (elements.whatsapp.hero) {
            elements.whatsapp.hero.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(createWhatsAppUrl('Olá, tenho interesse nos seus serviços de desenvolvimento. Me forneça informações, por favor.'), '_blank');
            });
        }

        if (elements.whatsapp.link) {
            elements.whatsapp.link.href = createWhatsAppUrl(CONFIG.whatsapp.defaultMessage);
        }
    }

    // === Modal de Imagens ===
    function setupImageModal() {
        if (!elements.modal.container || !elements.modal.image || !elements.modal.caption || !elements.modal.close) return;

        function openModal(imgSrc, caption) {
            if (!imgSrc) return;
            const img = new Image();
            img.src = imgSrc;
            elements.modal.container.style.display = 'flex';
            elements.modal.image.style.opacity = '0';
            document.body.style.overflow = 'hidden';

            img.onload = () => {
                elements.modal.image.src = imgSrc;
                elements.modal.caption.textContent = caption || '';
                elements.modal.image.style.opacity = '1';
                elements.modal.container.classList.add('active');
            };
        }

        function closeModal() {
            elements.modal.container.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                elements.modal.container.style.display = 'none';
                elements.modal.image.src = '';
            }, CONFIG.modal.transitionTime);
        }

        elements.modal.close.addEventListener('click', closeModal);
        elements.modal.container.addEventListener('click', (e) => {
            if (e.target === elements.modal.container) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.modal.container.style.display === 'flex') closeModal();
        });

        document.querySelectorAll('.project-card').forEach(card => {
            const img = card.querySelector('img');
            const btn = card.querySelector('.view-image');
            if (img && btn) {
                const handleClick = (e) => {
                    e.preventDefault();
                    openModal(img.src, img.alt);
                };
                img.addEventListener('click', handleClick);
                btn.addEventListener('click', handleClick);
            }
        });
    }

    // === Formulário de Contato ===
    window.sendWhatsApp = function(e) {
        e.preventDefault();

        const form = {
            nome: document.getElementById('nome').value.trim(),
            assunto: document.getElementById('assunto').value.trim(),
            site: document.getElementById('site').value.trim(),
            mensagem: document.getElementById('mensagem').value.trim()
        };

        if (!form.nome || !form.assunto || !form.mensagem) {
            alert('Preencha os campos obrigatórios.');
            return false;
        }

        // Mensagem limpa com quebras de linha naturais
        let message = `Pedido de orçamento:
Nome: ${form.nome}
Assunto: ${form.assunto}`;
        if (form.site) message += `\nWebsite: ${form.site}`;
        message += `\nDescrição: ${form.mensagem}`;

        window.open(createWhatsAppUrl(message), '_blank');
        return false;
    };

    // === Inicialização ===
    if (elements.year) elements.year.textContent = new Date().getFullYear();
    
    setupWhatsAppLinks();
    setupImageModal();
});
