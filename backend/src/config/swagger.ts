/**
 * Swagger/OpenAPI Configuration
 * API documentation setup
 */

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'HomeOS API',
            version: '2.0.0',
            description: 'USB\'den Başlatılabilir Linux Sistem Yönetim API\'si',
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            },
            contact: {
                name: 'HomeOS Team',
                url: 'https://github.com/homeos',
                email: 'info@homeos.io'
            }
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Development server'
            },
            {
                url: 'https://api.homeos.io',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                },
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'accessToken'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        basarili: {
                            type: 'boolean',
                            example: false
                        },
                        hata: {
                            type: 'object',
                            properties: {
                                mesaj: { type: 'string' },
                                kod: { type: 'string' },
                                detaylar: { type: 'object' }
                            }
                        }
                    }
                },
                Kullanici: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        kullaniciAdi: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        ad: { type: 'string' },
                        soyad: { type: 'string' },
                        rol: { type: 'string', enum: ['yonetici', 'kullanici'] },
                        aktif: { type: 'boolean' },
                        olusturulmaTarihi: { type: 'string', format: 'date-time' }
                    }
                },
                SistemIstatistikleri: {
                    type: 'object',
                    properties: {
                        cpu: {
                            type: 'object',
                            properties: {
                                kullanim: { type: 'number' },
                                cekirdekSayisi: { type: 'number' },
                                model: { type: 'string' },
                                hiz: { type: 'number' }
                            }
                        },
                        bellek: {
                            type: 'object',
                            properties: {
                                toplam: { type: 'number' },
                                kullanilan: { type: 'number' },
                                bos: { type: 'number' },
                                kullanimYuzdesi: { type: 'number' }
                            }
                        },
                        disk: {
                            type: 'object',
                            properties: {
                                toplam: { type: 'number' },
                                kullanilan: { type: 'number' },
                                bos: { type: 'number' },
                                kullanimYuzdesi: { type: 'number' }
                            }
                        }
                    }
                },
                DockerKonteyner: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        ad: { type: 'string' },
                        imaj: { type: 'string' },
                        durum: { type: 'string' },
                        calismaDurumu: { type: 'string' },
                        portlar: { type: 'array', items: { type: 'object' } }
                    }
                }
            }
        },
        tags: [
            { name: 'Kimlik', description: 'Kimlik doğrulama ve yetkilendirme' },
            { name: 'Sistem', description: 'Sistem bilgileri ve işlemleri' },
            { name: 'Docker', description: 'Docker konteyner yönetimi' },
            { name: 'Dosyalar', description: 'Dosya ve dizin işlemleri' },
            { name: 'Kullanıcılar', description: 'Kullanıcı yönetimi' }
        ]
    },
    apis: ['./src/rotalar/*.ts', './src/index.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
