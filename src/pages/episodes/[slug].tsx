import Head from 'next/head';
import format from 'date-fns/format';
import Image from 'next/image';
import Link from 'next/link';

import { GetStaticProps, GetStaticPaths } from 'next';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import { parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api } from '../../services/api';
import { useContext } from 'react';
import { PlayerContexts } from '../../contexts/PlayerContexts';

import styles from '../../styles/episodes.module.scss';

type Episode = {
  id: string,
  title: string,
  members: string,
  description: string,
  thumbnail: string,
  duration: number,
  durantionAsString: string,
  url: string,
  publishedAt: string,
}

type EpisodeProps = {
  episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
  const { play } = useContext(PlayerContexts);
  return(
    <div className={styles.episodes}>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>
        <div className={styles.thumbnailContainer}>
          <Link href="/">
            <button type="button">
              <img src="/arrow-left.svg" alt="Voltar" />
            </button>
          </Link>
          <Image 
          width={700}
          height={160} 
          src={episode.thumbnail} 
          objectFit="cover"
          />
          <button type="button" onClick={() => play(episode)}>
            <img src="/play.svg" alt="Tocar episódio" />
          </button>
        </div>

        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.durantionAsString}</span>
        </header>

        <div className={styles.description} 
        dangerouslySetInnerHTML={{ __html: episode.description }}
        />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const {data} = await api.get(`episodes`, {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const paths = data.map(episode => {
    return{
      params: {
        slug: episode.id
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  }
}


export const getStaticProps: GetStaticProps = async (ctx) => {
  const {slug} = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
      id: data.id,
      title: data.title,
      thumbnail: data.thumbnail,
      members: data.members,
      description: data.description,
      publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(data.file.duration),
      durantionAsString: convertDurationToTimeString(Number(data.file.duration)),
      url: data.file.url,
  };

  return{ 
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, //24 horas
  }
}