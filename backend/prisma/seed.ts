import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const GAME_CATALOG = [
  {
    name: 'PUBG Mobile',
    slug: 'pubg-mobile',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgcng9IjIwIiBmaWxsPSIjMTExODI3Ii8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgcng9IjE1IiBmaWxsPSIjMWYyOTM3Ii8+PHRleHQgeD0iMTAwIiB5PSI5MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjQwIiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjZjk3MzE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QVUJHPC90ZXh0Pjx0ZXh0IHg9IjEwMCIgeT0iMTMwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZmFjYzE1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NT0JJTEU8L3RleHQ+PC9zdmc+',
    packages: [
      { title: '60 UC', amount: 60, price: 12000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5MCIgZmlsbD0iI2ZhY2MxNSIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNzUiIGZpbGw9IiNlYWIzMDgiLz48dGV4dCB4PSIxMDAiIHk9IjEyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjcwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzcxM2YxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VUM8L3RleHQ+PC9zdmc+' },
      { title: '325 UC', amount: 325, price: 55000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5MCIgZmlsbD0iI2ZhY2MxNSIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNzUiIGZpbGw9IiNlYWIzMDgiLz48dGV4dCB4PSIxMDAiIHk9IjEyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjcwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzcxM2YxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VUM8L3RleHQ+PC9zdmc+' },
      { title: '660 UC', amount: 660, price: 110000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5MCIgZmlsbD0iI2ZhY2MxNSIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNzUiIGZpbGw9IiNlYWIzMDgiLz48dGV4dCB4PSIxMDAiIHk9IjEyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjcwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzcxM2YxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VUM8L3RleHQ+PC9zdmc+' },
      { title: '1800 UC', amount: 1800, price: 280000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5MCIgZmlsbD0iI2ZhY2MxNSIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNzUiIGZpbGw9IiNlYWIzMDgiLz48dGV4dCB4PSIxMDAiIHk9IjEyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjcwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzcxM2YxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VUM8L3RleHQ+PC9zdmc+' },
    ],
  },
  {
    name: 'Mobile Legends',
    slug: 'mobile-legends',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgcng9IjIwIiBmaWxsPSIjMWUzYThhIi8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgcng9IjE1IiBmaWxsPSIjMWQ0ZWQ4Ii8+PHRleHQgeD0iMTAwIiB5PSI5MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjZmJiZjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NT0JJTEU8L3RleHQ+PHRleHQgeD0iMTAwIiB5PSIxMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNmY2QzNGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxFR0VORFM8L3RleHQ+PC9zdmc+',
    packages: [
      { title: '86 Diamonds', amount: 86, price: 18000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwMCAxMCBMMTkwIDYwIEwxMDAgMTkwIEwxMCA2MCBaIiBmaWxsPSIjM2I4MmY2Ii8+PHBhdGggZD0iTTEwMCAxMCBMMTkwIDYwIEwxMDAgODAgTDEwIDYwIFoiIGZpbGw9IiM2MGE1ZmEiLz48cGF0aCBkPSJNMTAwIDEwIEwxMDAgODAgTDEwIDYwIFoiIGZpbGw9IiM5M2M1ZmQiLz48cGF0aCBkPSJNMTAwIDE5MCBMMTkwIDYwIEwxMDAgODAgWiIgZmlsbD0iIzI1NjNlYiIvPjwvc3ZnPg==' },
      { title: '172 Diamonds', amount: 172, price: 35000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwMCAxMCBMMTkwIDYwIEwxMDAgMTkwIEwxMCA2MCBaIiBmaWxsPSIjM2I4MmY2Ii8+PHBhdGggZD0iTTEwMCAxMCBMMTkwIDYwIEwxMDAgODAgTDEwIDYwIFoiIGZpbGw9IiM2MGE1ZmEiLz48cGF0aCBkPSJNMTAwIDEwIEwxMDAgODAgTDEwIDYwIFoiIGZpbGw9IiM5M2M1ZmQiLz48cGF0aCBkPSJNMTAwIDE5MCBMMTkwIDYwIEwxMDAgODAgWiIgZmlsbD0iIzI1NjNlYiIvPjwvc3ZnPg==' },
      { title: '257 Diamonds', amount: 257, price: 52000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwMCAxMCBMMTkwIDYwIEwxMDAgMTkwIEwxMCA2MCBaIiBmaWxsPSIjM2I4MmY2Ii8+PHBhdGggZD0iTTEwMCAxMCBMMTkwIDYwIEwxMDAgODAgTDEwIDYwIFoiIGZpbGw9IiM2MGE1ZmEiLz48cGF0aCBkPSJNMTAwIDEwIEwxMDAgODAgTDEwIDYwIFoiIGZpbGw9IiM5M2M1ZmQiLz48cGF0aCBkPSJNMTAwIDE5MCBMMTkwIDYwIEwxMDAgODAgWiIgZmlsbD0iIzI1NjNlYiIvPjwvc3ZnPg==' },
      { title: '514 Diamonds', amount: 514, price: 98000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwMCAxMCBMMTkwIDYwIEwxMDAgMTkwIEwxMCA2MCBaIiBmaWxsPSIjM2I4MmY2Ii8+PHBhdGggZD0iTTEwMCAxMCBMMTkwIDYwIEwxMDAgODAgTDEwIDYwIFoiIGZpbGw9IiM2MGE1ZmEiLz48cGF0aCBkPSJNMTAwIDEwIEwxMDAgODAgTDEwIDYwIFoiIGZpbGw9IiM5M2M1ZmQiLz48cGF0aCBkPSJNMTAwIDE5MCBMMTkwIDYwIEwxMDAgODAgWiIgZmlsbD0iIzI1NjNlYiIvPjwvc3ZnPg==' },
    ],
  },
  {
    name: 'Free Fire',
    slug: 'free-fire',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgcng9IjIwIiBmaWxsPSIjN2YxZDFkIi8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgcng9IjE1IiBmaWxsPSIjOTkxYjFiIi8+PHRleHQgeD0iMTAwIiB5PSIxMTUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZm9udC13ZWlnaHQ9IjkwMCIgZmlsbD0iI2ZlZjA4YSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RlJFRTwvdGV4dD48dGV4dCB4PSIxMDAiIHk9IjE2MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjQwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZkZTA0NyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RklSRTwvdGV4dD48cGF0aCBkPSJNMTAwIDMwIFExMjAgNjAgMTAwIDgwIFExMzAgNTAgMTUwIDcwIFExMTAgMTEwIDEwMCA5MCBRODAgMTIwIDUwIDgwIFE3MCA2MCAxMDAgMzAgWiIgZmlsbD0iI2ZhY2MxNSIvPjwvc3ZnPg==',
    packages: [
      { title: '100 Diamonds', amount: 100, price: 15000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwMCAyMCBMMTgwIDgwIEwxMDAgMTgwIEwyMCA4MCBaIiBmaWxsPSIjMDZiNmQ0Ii8+PHBhdGggZD0iTTEwMCAyMCBMMTgwIDgwIEwxMDAgMTAwIEwyMCA4MCBaIiBmaWxsPSIjMjJkM2VlIi8+PHBhdGggZD0iTTEwMCAyMCBMMTAwIDEwMCBMMjAgODAgWiIgZmlsbD0iIzY3ZThmOSIvPjxwYXRoIGQ9Ik0xMDAgMTgwIEwxODAgODAgTDEwMCAxMDAgWiIgZmlsbD0iIzA4OTFiMiIvPjwvc3ZnPg==' },
      { title: '310 Diamonds', amount: 310, price: 42000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwMCAyMCBMMTgwIDgwIEwxMDAgMTgwIEwyMCA4MCBaIiBmaWxsPSIjMDZiNmQ0Ii8+PHBhdGggZD0iTTEwMCAyMCBMMTgwIDgwIEwxMDAgMTAwIEwyMCA4MCBaIiBmaWxsPSIjMjJkM2VlIi8+PHBhdGggZD0iTTEwMCAyMCBMMTAwIDEwMCBMMjAgODAgWiIgZmlsbD0iIzY3ZThmOSIvPjxwYXRoIGQ9Ik0xMDAgMTgwIEwxODAgODAgTDEwMCAxMDAgWiIgZmlsbD0iIzA4OTFiMiIvPjwvc3ZnPg==' },
      { title: '520 Diamonds', amount: 520, price: 68000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwMCAyMCBMMTgwIDgwIEwxMDAgMTgwIEwyMCA4MCBaIiBmaWxsPSIjMDZiNmQ0Ii8+PHBhdGggZD0iTTEwMCAyMCBMMTgwIDgwIEwxMDAgMTAwIEwyMCA4MCBaIiBmaWxsPSIjMjJkM2VlIi8+PHBhdGggZD0iTTEwMCAyMCBMMTAwIDEwMCBMMjAgODAgWiIgZmlsbD0iIzY3ZThmOSIvPjxwYXRoIGQ9Ik0xMDAgMTgwIEwxODAgODAgTDEwMCAxMDAgWiIgZmlsbD0iIzA4OTFiMiIvPjwvc3ZnPg==' },
      { title: '1060 Diamonds', amount: 1060, price: 130000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwMCAyMCBMMTgwIDgwIEwxMDAgMTgwIEwyMCA4MCBaIiBmaWxsPSIjMDZiNmQ0Ii8+PHBhdGggZD0iTTEwMCAyMCBMMTgwIDgwIEwxMDAgMTAwIEwyMCA4MCBaIiBmaWxsPSIjMjJkM2VlIi8+PHBhdGggZD0iTTEwMCAyMCBMMTAwIDEwMCBMMjAgODAgWiIgZmlsbD0iIzY3ZThmOSIvPjxwYXRoIGQ9Ik0xMDAgMTgwIEwxODAgODAgTDEwMCAxMDAgWiIgZmlsbD0iIzA4OTFiMiIvPjwvc3ZnPg==' },
    ],
  },
  {
    name: 'Valorant',
    slug: 'valorant',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgcng9IjIwIiBmaWxsPSIjZmY0NjU1Ii8+PHBhdGggZD0iTTYwIDUwIEwxMDAgMTMwIEwxMTAgMTAwIEw3MCA1MCBaIiBmaWxsPSIjZmZmZmZmIi8+PHBhdGggZD0iTTExNSA1MCBMMTA1IDEzMCBMMTQwIDUwIFoiIGZpbGw9IiNmZmZmZmYiLz48dGV4dCB4PSIxMDAiIHk9IjE3NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIyIiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5WQUxPUkFOVDwvdGV4dD48L3N2Zz4=',
    packages: [
      { title: '475 VP', amount: 475, price: 45000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5MCIgZmlsbD0iI2VmNDQ0NCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNzUiIGZpbGw9IiNkYzI2MjYiLz48dGV4dCB4PSIxMDAiIHk9IjEyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjcwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZlZTJlMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VjwvdGV4dD48L3N2Zz4=' },
      { title: '1000 VP', amount: 1000, price: 90000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5MCIgZmlsbD0iI2VmNDQ0NCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNzUiIGZpbGw9IiNkYzI2MjYiLz48dGV4dCB4PSIxMDAiIHk9IjEyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjcwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZlZTJlMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VjwvdGV4dD48L3N2Zz4=' },
      { title: '2050 VP', amount: 2050, price: 175000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5MCIgZmlsbD0iI2VmNDQ0NCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNzUiIGZpbGw9IiNkYzI2MjYiLz48dGV4dCB4PSIxMDAiIHk9IjEyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjcwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZlZTJlMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VjwvdGV4dD48L3N2Zz4=' },
      { title: '3650 VP', amount: 3650, price: 300000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5MCIgZmlsbD0iI2VmNDQ0NCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNzUiIGZpbGw9IiNkYzI2MjYiLz48dGV4dCB4PSIxMDAiIHk9IjEyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjcwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZlZTJlMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VjwvdGV4dD48L3N2Zz4=' },
    ],
  },
  {
    name: 'Steam',
    slug: 'steam',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgcng9IjIwIiBmaWxsPSIjMTcxYTIxIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iOTAiIHI9IjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiM2NmMwZjQiIHN0cm9rZS13aWR0aD0iMTIiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI5MCIgcj0iMjAiIGZpbGw9IiM2NmMwZjQiLz48dGV4dCB4PSIxMDAiIHk9IjE2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2M3ZDVlMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U1RFQU08L3RleHQ+PC9zdmc+',
    packages: [
      { title: '5 USD', amount: 5, price: 65000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMTAiIHk9IjUwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjEwMCIgcng9IjE1IiBmaWxsPSIjMWUyOTNiIi8+PHJlY3QgeD0iMTAiIHk9IjUwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjMGYxNzJhIi8+PHRleHQgeD0iMTAwIiB5PSIxMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNlMmU4ZjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNURUFNPC90ZXh0Pjwvc3ZnPg==' },
      { title: '10 USD', amount: 10, price: 125000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMTAiIHk9IjUwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjEwMCIgcng9IjE1IiBmaWxsPSIjMWUyOTNiIi8+PHJlY3QgeD0iMTAiIHk9IjUwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjMGYxNzJhIi8+PHRleHQgeD0iMTAwIiB5PSIxMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNlMmU4ZjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNURUFNPC90ZXh0Pjwvc3ZnPg==' },
      { title: '20 USD', amount: 20, price: 245000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMTAiIHk9IjUwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjEwMCIgcng9IjE1IiBmaWxsPSIjMWUyOTNiIi8+PHJlY3QgeD0iMTAiIHk9IjUwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjMGYxNzJhIi8+PHRleHQgeD0iMTAwIiB5PSIxMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNlMmU4ZjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNURUFNPC90ZXh0Pjwvc3ZnPg==' },
      { title: '50 USD', amount: 50, price: 600000, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMTAiIHk9IjUwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjEwMCIgcng9IjE1IiBmaWxsPSIjMWUyOTNiIi8+PHJlY3QgeD0iMTAiIHk9IjUwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjMGYxNzJhIi8+PHRleHQgeD0iMTAwIiB5PSIxMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNlMmU4ZjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNURUFNPC90ZXh0Pjwvc3ZnPg==' },
    ],
  },
];

async function main() {
  const cardCount = await prisma.paymentCard.count();
  if (cardCount === 0) {
    await prisma.paymentCard.createMany({
      data: [
        {
          cardHolder: 'OGABEK O.',
          cardNumber: '8600 1234 5678 9012',
          bankName: 'Agrobank',
        },
        {
          cardHolder: 'OGABEK O.',
          cardNumber: '9860 5678 1234 9012',
          bankName: 'Humo - TBC Bank',
        },
      ],
    });
    console.log('Seeded payment cards');
  }

  for (const gameData of GAME_CATALOG) {
    const game = await prisma.game.upsert({
      where: { slug: gameData.slug },
      update: {
        name: gameData.name,
        logo: gameData.logo,
        status: 'active',
      },
      create: {
        name: gameData.name,
        slug: gameData.slug,
        logo: gameData.logo,
        status: 'active',
      },
    });

    for (const pkg of gameData.packages) {
      const existing = await prisma.package.findFirst({
        where: { gameId: game.id, title: pkg.title },
      });

      if (existing) {
        await prisma.package.update({
          where: { id: existing.id },
          data: { amount: pkg.amount, price: pkg.price, image: (pkg as any).image, status: 'active' },
        });
      } else {
        await prisma.package.create({
          data: {
            gameId: game.id,
            title: pkg.title,
            amount: pkg.amount,
            price: pkg.price,
            image: (pkg as any).image,
            status: 'active',
          },
        });
      }
    }

    console.log(`Synced game: ${gameData.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
