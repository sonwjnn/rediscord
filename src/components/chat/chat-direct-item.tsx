'use client';

import { Hint } from '@/components/hint';
import { MemberProfile } from '@/components/member/member-profile';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatar } from '@/components/user-avatar';
import { getServerById } from '@/data/server';
import { useCurrentUser } from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';
import { ChatItemSchema } from '@/schemas';
import { useModal } from '@/store/use-modal-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import axios from 'axios';
import { Edit, FileIcon, Trash } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import qs from 'query-string';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ExtendedUser } from '../../../next-auth';





interface Props {
  id: string
  content: string
  otherUser: User
  timestamp: string
  fileUrl: string | null
  deleted: boolean
  currentUser: ExtendedUser
  isUpdated: boolean
  socketUrl: string
  socketQuery: Record<string, string>
}


export const ChatDirectItem = ({
  id,
  content,
  otherUser,
  timestamp,
  fileUrl,
  deleted,
  currentUser,
  isUpdated,
  socketUrl,
  socketQuery,
}: Props) => {
  const user = useCurrentUser()
  const [isEditing, setIsEditing] = useState(false)

  const { onOpen } = useModal()
  const params = useParams()
  const router = useRouter()

  // const onMemberClick = () => {
  //   if (member.id === currentMember.id) {
  //     return
  //   }

  //   router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  // }

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        setIsEditing(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keyDown', handleKeyDown)
  }, [])

  const form = useForm<z.infer<typeof ChatItemSchema>>({
    resolver: zodResolver(ChatItemSchema),
    defaultValues: {
      content: content,
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof ChatItemSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      })

      await axios.patch(url, { ...values, user })

      form.reset()
      setIsEditing(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    form.reset({
      content: content,
    })
  }, [form, content])

  const fileType = fileUrl?.split('.').pop()

  const isOwner = currentUser.id === otherUser.id
  const canDeleteMessage = !deleted && isOwner
  const canEditMessage = !deleted && isOwner
  const isPDF = fileType === 'pdf' && fileUrl
  const isImage = !isPDF && fileUrl

  return (
    <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5 gap-x-2.5">
      <div className="group flex items-start gap-x-2">
        {/* <MemberProfileWrapper server={server} member={member}>
          <div
            // onClick={onMemberClick}
            className="cursor-pointer transition hover:drop-shadow-md"
          > */}
            <UserAvatar
              imageUrl={otherUser.image!}
              name={otherUser.name!}
            />
          </div>
        {/* </MemberProfileWrapper> */}

        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
              {/* <MemberProfileWrapper server={server} member={member}> */}
              <p className="cursor-pointer text-sm font-semibold text-zinc-600 hover:underline dark:text-zinc-300">
                {otherUser.name}
              </p>
              {/* </MemberProfileWrapper> */}
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md border bg-secondary"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
                sizes="100%"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative mt-2 flex items-center rounded-md bg-background/10 p-2">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400"
              >
                PDF File
              </a>
            </div>
          )}
          {!isEditing && (
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                deleted &&
                  'mt-1 text-xs italic text-zinc-500 dark:text-zinc-400'
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="mx-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {isEditing && (
            <Form {...form}>
              <form
                className="flex w-full items-center gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="border-0 border-none bg-zinc-200/90 p-2 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                  {isLoading ? <Spinner className="mr-2" /> : null}
                  Save
                </Button>
              </form>
              <span className="mt-1 text-[10px] text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      {canDeleteMessage && (
        <div className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-zinc-800">
          {canEditMessage && (
            <Hint label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
              />
            </Hint>
          )}
          <Hint label="Delete">
            <Trash
              onClick={() =>
                onOpen('deleteMessage', {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
            />
          </Hint>
        </div>
      )}
    </div>
  )
}

export const ChatItemSkeleton = () => (
  <div className="flex w-full items-center gap-x-2 p-4 transition hover:bg-black/5">
    <Skeleton className="min-h-8 min-w-8 rounded-full" />
    <div className="flex w-full flex-col gap-y-2">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-20 w-full md:w-80" />
    </div>
  </div>
)