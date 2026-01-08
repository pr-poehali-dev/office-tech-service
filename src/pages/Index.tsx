import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [calculatorData, setCalculatorData] = useState({
    deviceType: '',
    brand: '',
    issueType: '',
    urgency: 'standard'
  });

  const services = [
    {
      icon: 'Wrench',
      title: 'Ремонт оргтехники',
      description: 'Профессиональный ремонт принтеров, МФУ, копиров любой сложности'
    },
    {
      icon: 'Settings',
      title: 'Обслуживание',
      description: 'Регулярное техническое обслуживание для бесперебойной работы'
    },
    {
      icon: 'Package',
      title: 'Расходные материалы',
      description: 'Широкий ассортимент оригинальных и совместимых расходников'
    },
    {
      icon: 'Clock',
      title: 'Срочный выезд',
      description: 'Выезд специалиста в течение 2 часов после заявки'
    }
  ];

  const allSupplies = [
    {
      category: 'Картриджи для лазерных принтеров',
      items: [
        { name: 'HP LaserJet CF217A (17A)', price: '3 500', stock: true },
        { name: 'Canon 725 (Cartridge 725)', price: '2 800', stock: true },
        { name: 'Samsung MLT-D101S', price: '2 200', stock: true },
        { name: 'Xerox Phaser 3020/3025 (106R02773)', price: '2 900', stock: false }
      ]
    },
    {
      category: 'Тонеры для копиров',
      items: [
        { name: 'Sharp MX-23GT', price: '4 200', stock: true },
        { name: 'Konica Minolta TN-116', price: '3 800', stock: true },
        { name: 'Ricoh MP C2503', price: '5 100', stock: true }
      ]
    },
    {
      category: 'Фотобарабаны',
      items: [
        { name: 'Brother DR-2335', price: '4 500', stock: true },
        { name: 'HP CF234A (34A)', price: '8 900', stock: true },
        { name: 'Kyocera DK-1150', price: '6 200', stock: false }
      ]
    }
  ];

  const blogPosts = [
    {
      title: '5 признаков того, что вашему принтеру нужно ТО',
      date: '15 декабря 2024',
      excerpt: 'Регулярное техническое обслуживание продлевает срок службы оргтехники в 2-3 раза...'
    },
    {
      title: 'Как выбрать правильный картридж для вашего МФУ',
      date: '10 декабря 2024',
      excerpt: 'Оригинальные или совместимые? Разбираемся в особенностях расходных материалов...'
    },
    {
      title: 'Топ-3 ошибки при эксплуатации копировальной техники',
      date: '5 декабря 2024',
      excerpt: 'Избегайте этих распространенных ошибок, чтобы оргтехника работала дольше...'
    }
  ];

  const filteredSupplies = useMemo(() => {
    if (!searchQuery.trim()) return allSupplies;
    
    const query = searchQuery.toLowerCase();
    return allSupplies.map(category => ({
      ...category,
      items: category.items.filter(item => 
        item.name.toLowerCase().includes(query)
      )
    })).filter(category => category.items.length > 0);
  }, [searchQuery]);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('https://functions.poehali.dev/e6e3a015-3d04-45fa-baa2-763ae25f58cf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateRepairCost = () => {
    let baseCost = 0;
    
    if (calculatorData.deviceType === 'printer') baseCost = 1500;
    else if (calculatorData.deviceType === 'mfu') baseCost = 2000;
    else if (calculatorData.deviceType === 'copier') baseCost = 2500;
    else if (calculatorData.deviceType === 'scanner') baseCost = 1200;
    
    if (calculatorData.issueType === 'diagnostic') baseCost += 0;
    else if (calculatorData.issueType === 'cleaning') baseCost += 800;
    else if (calculatorData.issueType === 'repair') baseCost += 2000;
    else if (calculatorData.issueType === 'replacement') baseCost += 3500;
    
    if (calculatorData.urgency === 'urgent') baseCost *= 1.3;
    
    return baseCost;
  };

  const faqs = [
    {
      question: 'Какие гарантии вы предоставляете на ремонт?',
      answer: 'Мы предоставляем гарантию 6 месяцев на все виды ремонтных работ и 3 месяца на установленные запчасти. Гарантия распространяется на все выполненные работы при условии соблюдения правил эксплуатации.'
    },
    {
      question: 'Как быстро вы можете выехать на объект?',
      answer: 'Стандартный выезд специалиста осуществляется в течение 24 часов. Для срочных случаев доступна услуга экспресс-выезда – в течение 2 часов с момента заявки (доплата 30% к стоимости работ).'
    },
    {
      question: 'Вы работаете с юридическими лицами?',
      answer: 'Да, мы специализируемся на обслуживании корпоративных клиентов. Предоставляем полный пакет документов, работаем по договору, возможна отсрочка платежа для постоянных клиентов.'
    },
    {
      question: 'Какие марки оргтехники вы обслуживаете?',
      answer: 'Мы работаем со всеми основными производителями: HP, Canon, Xerox, Samsung, Brother, Epson, Ricoh, Konica Minolta, Kyocera, Sharp и другими. Наши специалисты имеют сертификаты производителей.'
    },
    {
      question: 'Можно ли заказать расходники с доставкой?',
      answer: 'Да, мы осуществляем доставку расходных материалов по Москве и области. Бесплатная доставка при заказе от 5000 рублей. Срок доставки 1-2 рабочих дня.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Printer" size={28} className="text-accent" />
            <span className="text-xl font-bold">ТехноСервис</span>
          </div>
          <nav className="hidden md:flex gap-6">
            {[
              { id: 'home', label: 'Главная' },
              { id: 'supplies', label: 'Расходники' },
              { id: 'about', label: 'О компании' },
              { id: 'contacts', label: 'Контакты' },
              { id: 'faq', label: 'Вопросы' },
              { id: 'blog', label: 'Блог' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  activeSection === item.id ? 'text-accent' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <Button className="hidden md:inline-flex">
            <Icon name="Phone" size={16} className="mr-2" />
            Заказать звонок
          </Button>
        </div>
      </header>

      <main>
        {activeSection === 'home' && (
          <>
            <section className="py-20 md:py-32">
              <div className="container">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <Badge className="w-fit">Более 15 лет на рынке</Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      Профессиональный ремонт и обслуживание оргтехники
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      Быстрый ремонт, качественное обслуживание и полный ассортимент расходных материалов для вашего бизнеса
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button size="lg" className="text-base">
                        <Icon name="FileText" size={18} className="mr-2" />
                        Прайс-лист
                      </Button>
                      <Button size="lg" variant="outline" className="text-base">
                        <Icon name="MessageSquare" size={18} className="mr-2" />
                        Консультация
                      </Button>
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-8 h-96 flex items-center justify-center">
                    <Icon name="Printer" size={120} className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            </section>

            <section className="py-16 bg-muted/50">
              <div className="container">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Наши услуги</h2>
                  <p className="text-muted-foreground text-lg">
                    Полный спектр услуг по ремонту и обслуживанию оргтехники
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {services.map((service, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                          <Icon name={service.icon} size={24} className="text-accent" />
                        </div>
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">{service.description}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-16">
              <div className="container">
                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                          <Icon name="Award" size={24} className="text-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-3xl font-bold">15+</CardTitle>
                          <CardDescription>лет опыта</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                          <Icon name="Users" size={24} className="text-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-3xl font-bold">500+</CardTitle>
                          <CardDescription>корпоративных клиентов</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                          <Icon name="CheckCircle" size={24} className="text-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-3xl font-bold">98%</CardTitle>
                          <CardDescription>успешных ремонтов</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </div>

                <Card className="max-w-3xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">Калькулятор стоимости ремонта</CardTitle>
                    <CardDescription className="text-center">Получите примерную оценку за 1 минуту</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Тип устройства</label>
                        <select 
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          value={calculatorData.deviceType}
                          onChange={(e) => setCalculatorData(prev => ({ ...prev, deviceType: e.target.value }))}
                        >
                          <option value="">Выберите тип</option>
                          <option value="printer">Принтер</option>
                          <option value="mfu">МФУ</option>
                          <option value="copier">Копир</option>
                          <option value="scanner">Сканер</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Марка</label>
                        <Input 
                          placeholder="HP, Canon, Xerox..." 
                          value={calculatorData.brand}
                          onChange={(e) => setCalculatorData(prev => ({ ...prev, brand: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Тип работы</label>
                      <select 
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={calculatorData.issueType}
                        onChange={(e) => setCalculatorData(prev => ({ ...prev, issueType: e.target.value }))}
                      >
                        <option value="">Выберите тип работы</option>
                        <option value="diagnostic">Диагностика</option>
                        <option value="cleaning">Чистка и профилактика</option>
                        <option value="repair">Ремонт</option>
                        <option value="replacement">Замена узлов</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Срочность</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="urgency" 
                            value="standard"
                            checked={calculatorData.urgency === 'standard'}
                            onChange={(e) => setCalculatorData(prev => ({ ...prev, urgency: e.target.value }))}
                            className="w-4 h-4"
                          />
                          <span>Стандартный (24ч)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="urgency" 
                            value="urgent"
                            checked={calculatorData.urgency === 'urgent'}
                            onChange={(e) => setCalculatorData(prev => ({ ...prev, urgency: e.target.value }))}
                            className="w-4 h-4"
                          />
                          <span>Срочный (2ч) +30%</span>
                        </label>
                      </div>
                    </div>
                    {calculatorData.deviceType && calculatorData.issueType && (
                      <div className="p-6 bg-accent/10 rounded-lg border-2 border-accent">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Примерная стоимость</p>
                          <p className="text-4xl font-bold text-accent">{calculateRepairCost().toLocaleString()} ₽</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            *Точная стоимость определяется после диагностики
                          </p>
                        </div>
                      </div>
                    )}
                    <Button className="w-full" size="lg" onClick={() => setActiveSection('contacts')}>
                      <Icon name="Phone" size={18} className="mr-2" />
                      Оставить заявку
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </section>
          </>
        )}

        {activeSection === 'supplies' && (
          <section className="py-16">
            <div className="container">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Каталог расходных материалов</h2>
                <p className="text-muted-foreground text-lg">
                  Актуальный прайс-лист на расходники для оргтехники
                </p>
              </div>
              <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                  <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Поиск по каталогу..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8">
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="cartridges">Картриджи</TabsTrigger>
                  <TabsTrigger value="toners">Тонеры</TabsTrigger>
                  <TabsTrigger value="drums">Барабаны</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-6">
                  {filteredSupplies.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Ничего не найдено по запросу "{searchQuery}"</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredSupplies.map((category, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-xl">{category.category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {category.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between py-3 border-b last:border-0"
                            >
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                {!item.stock && (
                                  <Badge variant="outline" className="mt-1">
                                    Под заказ
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-xl font-bold">{item.price} ₽</span>
                                <Button size="sm" disabled={!item.stock}>
                                  <Icon name="ShoppingCart" size={16} className="mr-2" />
                                  Заказать
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )))}
                </TabsContent>
                <TabsContent value="cartridges">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">{allSupplies[0].category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {allSupplies[0].items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-3 border-b last:border-0"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              {!item.stock && (
                                <Badge variant="outline" className="mt-1">
                                  Под заказ
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xl font-bold">{item.price} ₽</span>
                              <Button size="sm" disabled={!item.stock}>
                                <Icon name="ShoppingCart" size={16} className="mr-2" />
                                Заказать
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="toners">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">{allSupplies[1].category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {allSupplies[1].items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-3 border-b last:border-0"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xl font-bold">{item.price} ₽</span>
                              <Button size="sm">
                                <Icon name="ShoppingCart" size={16} className="mr-2" />
                                Заказать
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="drums">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">{allSupplies[2].category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {allSupplies[2].items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-3 border-b last:border-0"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              {!item.stock && (
                                <Badge variant="outline" className="mt-1">
                                  Под заказ
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xl font-bold">{item.price} ₽</span>
                              <Button size="sm" disabled={!item.stock}>
                                <Icon name="ShoppingCart" size={16} className="mr-2" />
                                Заказать
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        )}

        {activeSection === 'about' && (
          <section className="py-16">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">О компании</h2>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>ТехноСервис – надежный партнер вашего бизнеса</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Компания ТехноСервис работает на рынке обслуживания офисной техники с 2009 года. За это время мы
                        обслужили более 500 корпоративных клиентов и выполнили более 10 000 ремонтов.
                      </p>
                      <p className="text-muted-foreground">
                        Наша команда состоит из сертифицированных специалистов с опытом работы от 5 лет. Мы постоянно
                        повышаем квалификацию и следим за новинками рынка оргтехники.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Наши преимущества</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          'Официальный сервисный центр основных производителей',
                          'Гарантия 6 месяцев на все виды работ',
                          'Оригинальные запчасти и расходники',
                          'Выезд специалиста в течение 2 часов',
                          'Прозрачное ценообразование',
                          'Работа с юридическими лицами'
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Icon name="CheckCircle" size={20} className="text-accent mt-1 flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Наши клиенты</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Среди наших постоянных клиентов крупные компании из различных сфер бизнеса:
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Банки', 'Страховые компании', 'Торговые сети', 'Производственные предприятия'].map(
                          (client, index) => (
                            <div key={index} className="bg-muted p-4 rounded-lg text-center font-medium">
                              {client}
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'contacts' && (
          <section className="py-16">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Контакты</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Свяжитесь с нами</CardTitle>
                      <CardDescription>Мы ответим на все ваши вопросы</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-start gap-4">
                        <Icon name="Phone" size={24} className="text-accent mt-1" />
                        <div>
                          <p className="font-medium">Телефон</p>
                          <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                          <p className="text-sm text-muted-foreground">Пн-Пт: 9:00 - 18:00</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Icon name="Mail" size={24} className="text-accent mt-1" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-muted-foreground">info@technoservice.ru</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Icon name="MapPin" size={24} className="text-accent mt-1" />
                        <div>
                          <p className="font-medium">Адрес</p>
                          <p className="text-muted-foreground">г. Москва, ул. Примерная, д. 123</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Оставьте заявку</CardTitle>
                      <CardDescription>И мы свяжемся с вами в ближайшее время</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Имя</label>
                          <Input 
                            placeholder="Ваше имя" 
                            value={formData.name}
                            onChange={(e) => handleFormChange('name', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Телефон</label>
                          <Input 
                            placeholder="+7 (___) ___-__-__" 
                            value={formData.phone}
                            onChange={(e) => handleFormChange('phone', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <Input 
                            type="email" 
                            placeholder="your@email.ru" 
                            value={formData.email}
                            onChange={(e) => handleFormChange('email', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Сообщение</label>
                          <Textarea 
                            placeholder="Опишите вашу задачу" 
                            rows={4} 
                            value={formData.message}
                            onChange={(e) => handleFormChange('message', e.target.value)}
                            required
                          />
                        </div>
                        {submitStatus === 'success' && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                            <Icon name="CheckCircle" size={16} className="inline mr-2" />
                            Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
                          </div>
                        )}
                        {submitStatus === 'error' && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                            <Icon name="AlertCircle" size={16} className="inline mr-2" />
                            Ошибка отправки. Попробуйте позже или позвоните нам.
                          </div>
                        )}
                        <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
                          <Icon name="Send" size={18} className="mr-2" />
                          {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'faq' && (
          <section className="py-16">
            <div className="container">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Часто задаваемые вопросы</h2>
                <Card>
                  <CardContent className="pt-6">
                    <Accordion type="single" collapsible className="w-full">
                      {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'blog' && (
          <section className="py-16">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Блог</h2>
                <div className="space-y-6">
                  {blogPosts.map((post, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Icon name="Calendar" size={16} />
                          <span>{post.date}</span>
                        </div>
                        <CardTitle className="text-2xl">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base mb-4">{post.excerpt}</CardDescription>
                        <Button variant="link" className="px-0">
                          Читать далее
                          <Icon name="ArrowRight" size={16} className="ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t py-12 bg-muted/50">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Printer" size={24} className="text-accent" />
                <span className="text-lg font-bold">ТехноСервис</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Профессиональный ремонт и обслуживание оргтехники с 2009 года
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Услуги</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Ремонт принтеров</li>
                <li>Обслуживание МФУ</li>
                <li>Продажа расходников</li>
                <li>Техническая поддержка</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Компания</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>О нас</li>
                <li>Наши клиенты</li>
                <li>Вакансии</li>
                <li>Контакты</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Контакты</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>+7 (495) 123-45-67</li>
                <li>info@technoservice.ru</li>
                <li>г. Москва, ул. Примерная, д. 123</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 ТехноСервис. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;