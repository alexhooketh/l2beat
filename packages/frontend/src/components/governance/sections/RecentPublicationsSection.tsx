import React from 'react'

import { GovernancePublicationEntry } from '../../../pages/governance/index/props/getGovernancePublicationEntry'
import { Button } from '../../Button'
import { LinkWithThumbnail } from '../../LinkWithThumbnail'
import { OutLink } from '../../OutLink'
import { GovernanceCard, GovernanceCardHeader } from '../GovernanceCard'

interface Props {
  publications: GovernancePublicationEntry[]
  className?: string
}

export function RecentPublicationsSection({ publications, className }: Props) {
  return (
    <GovernanceCard as="section" mobileFull className={className}>
      <div className="flex flex-wrap justify-between gap-2">
        <GovernanceCardHeader>Recent publications</GovernanceCardHeader>
        <ExploreAllButton className="hidden md:block" />
      </div>
      <div className="mt-8 flex flex-col gap-4">
        {publications.map((publication) => (
          <Publication publication={publication} key={publication.id} />
        ))}
      </div>
      <ExploreAllButton className="mt-6 w-full md:hidden" />
    </GovernanceCard>
  )
}

function ExploreAllButton({ className }: { className?: string }) {
  return (
    <OutLink href="https://medium.com/l2beat">
      <Button className={className} variant="purple" size="sm">
        Explore all publications
      </Button>
    </OutLink>
  )
}

interface PublicationProps {
  publication: GovernancePublicationEntry
}

function Publication({ publication }: PublicationProps) {
  return (
    <LinkWithThumbnail
      src={`/images/thumbnails/${publication.id}.png`}
      href={publication.link}
      title={publication.title}
    />
  )
}
