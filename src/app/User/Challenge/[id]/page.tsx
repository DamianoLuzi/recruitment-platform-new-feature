"use client";

import { useEffect, useState } from "react";
import Navbar from "../../navbar";
import Image from "next/image";
import supabase from "../../../../../utils/supabase";
import { MouseEvent } from "react";

interface ChallengeProps {
  id: number;
  title: string;
  img: string;
  desc: string;
}

interface ChallengeParams {
  params: {
    id: number;
  };
}

export default function Challenge({ params: { id } }: ChallengeParams) {
  const [challenge, setChallenge] = useState<ChallengeProps>();
  const [user, setUser] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  console.log(id);
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("Challenges")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        console.error(error);
        return;
      }
      setChallenge(data);
    }
    async function fetchUser() {
      const { data } = await supabase.auth.getSession();
      if (data && data.session?.user) {
        setUser(data.session.user.email);
      }
    }
    fetchData();
    fetchUser();
  }, [id]);

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    const { data: existingData } = await supabase
      .from("Home_Challenges")
      .select("*")
      .eq("email", user)
      .single();
    if (existingData == null) {
      const { data } = await supabase
        .from("Home_Challenges")
        .insert({
          email: user,
          challenges: [
            { steps: "1", title: challenge?.title, page_id: challenge?.id },
          ],
        })
        .select();
    } else {
      const { data, error } = await supabase
        .from("Home_Challenges")
        .update({
          challenges: [
            ...existingData.challenges,
            { steps: "1", title: challenge?.title, page_id: challenge?.id },
          ],
        })
        .eq("email", user);
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex flex-col">
      <Navbar />
      <div
        key={challenge?.title}
        className="bg-white flex lg:mt-48 mt-28 mb-16  mx-auto h-10/12 w-10/12 rounded-md overflow-hidden shadow"
      >
        <div className="hidden w-full h-full sm:block">
          <Image
            src={challenge?.img || ""}
            alt={`${id}`}
            className="object-cover border-l-4 border-sky-600 mr-4 h-full"
            width={550}
            height={96}
            loading="lazy"
            quality={80}
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="sm:hidden w-full">
            <Image
              src={challenge?.img || ""}
              alt={`${id}`}
              className="object-cover border-l-4 border-sky-600 w-full h-full "
              width={550}
              height={96}
              loading="lazy"
              quality={80}
            />
          </div>
          <div className="my-5 mx-5">
            <h2 className="text-2xl mb-3 font-bold text-sky-800">
              {challenge?.title}
            </h2>
            <h3 className="text-lg text-gray-500">{challenge?.desc}</h3>
          </div>
          {loading ? (
            <button
              onClick={handleClick}
              className="bg-emerald-400 px-8 py-2 mt-auto mb-5 rounded-md text-white text-xl font-semibold"
              disabled={loading}
            >
              Applied!
            </button>
          ) : (
            <button
              onClick={handleClick}
              className="bg-sky-500 px-8 py-2 mt-auto mb-5 rounded-md text-white text-xl font-semibold hover:bg-sky-600"
              disabled={loading}
            >
              Join!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
