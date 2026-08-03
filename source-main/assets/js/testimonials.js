// ===== TESTIMONIALS DATA =====
const testimonials = [
    {
        name: 'Andy Storms',
        date: '05/04/2025',
        avatar: 'assets/images/avt-tes-1.png',
        quote: 'I had a fantastic day fishing with Sang! I\'ve fished all over the US and Central America, and I have to say this is such a special fishery. Kayaking into brackish mangroves, hauling in barramundi and tarpon on a fly rod…absolutely world-class experience. (I also have to say I had my best food day in Vietnam thanks to his local knowledge.) Highly recommend!',
        link: 'https://www.facebook.com/share/p/19n3JgA61Z/'
    },
    {
        name: 'Robert E O\'Brien Jr',
        date: '12/04/2025',
        avatar: 'assets/images/avt-tes-2.png',
        quote: 'Great day fishing. A definite must',
        link: 'https://www.facebook.com/share/p/1Ba25LoKKb/'
    },
    {
        name: 'Jimmy Clement',
        date: '12/04/2025',
        avatar: 'assets/images/avt-tes-3.png',
        quote: 'Amazing day ! Sang is a great guide - very knowledgeable about all the types of fish we caught and about the ecosystem. Just a great and unique day. I can\'t wait to go again!',
        link: 'https://www.facebook.com/share/p/17HhiiZSRa/'
    },
    {
        name: 'Chris James',
        date: '08/04/2025',
        avatar: 'assets/images/avt-tes-4.png',
        quote: 'Sang is the best guide in Vietnam! I was an avid bass and inshore fisherman back home, and didn\'t know Vietnam had the same kind of fishing. Then I found Sang, and he put me on all kinds of fish: barramundi, tarpon, peacocks. If you\'re anywhere near Saigon, I highly recommend you give Sang a try.',
        link: 'https://www.facebook.com/share/p/17G8kY8a45/'
    },
    {
        name: 'Dale Watkins',
        date: '07/04/2025',
        avatar: 'assets/images/avt-tes-5.png',
        quote: 'Had a great time fishing with Sang in the mangroves for pacific tarpon and barramundi. I had never expected to find myself fly fishing in Vietnam, but Sang has really done great work promoting the sport and opening it up to visitors. I not only caught some great fish, but got the opportunity to see life off the beaten path in Vietnam. Looking forward to booking with Sang on my next trip and seeing more of the great fly fishing that Vietnam has to offer.',
        link: 'https://www.facebook.com/share/p/17UeXPBMDZ/'
    },
    {
        name: 'Stephen Robinson',
        date: '05/04/2025',
        avatar: 'assets/images/avt-tes-6.png',
        quote: 'An experience that is unforgettable and will have you telling the story time and again. I had an amazing fishing trip. The guides were informative and humorous. I had never been fly fishing before so they provided me with a set up that best fit me. By the end of the trip I also received a patient and thoughtful introduction to fly fishing. I\'m still working on my fly casting but I\'m definitely hooked!',
        link: 'https://www.facebook.com/share/p/1JPZfMfgT3/'
    },
    {
        name: 'Vu Pham',
        date: '05/04/2025',
        avatar: 'assets/images/avt-tes-7.png',
        quote: 'The BEST FISHING experience you could have in Vietnam.  By far my best trip I had with Wild Fishing Vietnam, very welcoming friendly and experienced guides helping you catch and land your favourite fish. DO IT, you\'ll never regret it. Experience what wild Vietnam has to offer.',
        link: 'https://www.facebook.com/share/p/19vJ3Pu8Dh/'
    },
    {
        name: 'Jon Shaffer',
        date: '05/04/2025',
        avatar: 'assets/images/avt-tes-8.png',
        quote: 'Enjoy natural outdoor beauty and adventure with Ly Chi Sang. Fly fishing oi. I\'m teaming up with the kayak fishing master. Sang has the experience and is fully licensed, not only as a fishing Captain, but he is the only one here,that I\'m aware of, who has the tour license and is fully established with the business license. He is committed to helping you to learn the art of fishing, with both fly and spinning gear. I\'m also a former charter boat Captain from Florida in the United States of America. He has taught me special techniques, and I\'m very impressed by his skill and dedication to helping his clients achieve the best fishing and ecotour adventures.',
        link: 'https://www.facebook.com/share/p/1BrMXxNZdc/'
    },
    {
        name: 'Ben Houghton',
        date: '05/04/2025',
        avatar: 'assets/images/avt-tes-9.png',
        quote: 'Fantastic guided kayak fishing experiences to be had with wild fish. While stocked fish are fun too, the real prize, in my opinion, are sneakier, harder fighting, wild fish. Sang has the local knowledge, the experience, and with new kayaks, a hard to beat combination for a great time fishing. Oh, and Sang speaks perfect English (Australian), and Vietnamese, so he\'s the perfect choice for foreigners looking to fish Vietnam. Can\'t rate highly enough!',
        link: 'https://www.facebook.com/share/p/17fzk7iyiY/'
    },
    {
        name: 'Lachlan Brown',
        date: '05/04/2025',
        avatar: 'assets/images/avt-tes-10.png',
        quote: 'Best guide service going around! The best fishing experience in Vietnam by far. Would definitely recommend to anyone.',
        link: 'https://www.facebook.com/share/p/1KbMG2Dsdo/'
    },
    {
        name: 'Kenji Sakana',
        date: '10/09/2025',
        avatar: 'assets/images/avt-tes-11.png',
        quote: 'Unique and exclusive experience in HCMC, all in one package. Just need to show up and fish 🫡',
        link: 'https://www.facebook.com/share/p/1M48fkyPJz/'
    },
    {
        name: 'Manh D Duong',
        date: '10/09/2025',
        avatar: 'assets/images/avt-tes-12.png',
        quote: 'Best kayak fishing!! I caught over 20 fish in a day',
        link: 'https://www.facebook.com/share/p/1BTyZeGyjk/'
    },
    {
        name: 'Bobby Cocozza',
        date: '08/09/2025',
        avatar: 'assets/images/avt-tes-13.png',
        quote: 'fun kayak fishing tour, highly recommend.',
        link: 'https://www.facebook.com/share/p/1DBPWLC8JU/'
    },
    {
        name: 'Jan Kamman',
        date: '24/08/2025',
        avatar: 'assets/images/avt-tes-14.png',
        quote: 'We had a real nice day kayak fishing with Sang. The fish wasn\'t very active, but we caught a pacific tarpon. Absolutely recommended!',
        link: 'https://www.facebook.com/share/p/19kEE8Bn4p/'
    },
    {
        name: 'Denorval Byrd',
        date: '07/07/2025',
        avatar: 'assets/images/avt-tes-15.png',
        quote: 'Very experienced guide. Super knowledgeable and helpful. I 100% recommend his service. I\'m a big guy a the kayak was very stable. I\'m about 120kg and I could stand up while fishing or paddling.',
        link: 'https://www.facebook.com/share/p/1JUu21aKci/'
    },
    {
        name: 'Lyle Sturgeon',
        date: '18/04/2025',
        avatar: 'assets/images/avt-tes-16.png',
        quote: 'Couldn\'t be happier than floating along in a kayak…As a complete beginner you can come out here and rest assured you\ll have an enjoyable experience. Sang gets you out on the water, and then you\'re away… Sang offers instructions that are just enough to give you understanding without getting in the way of the actual fishing. Being new to fly fishing I had many questions which I thought were a bit random, but he had answers to all of them (some straightforward ones and some sarcastic ones). The whole trip was so relaxing I didn\'t mind that I didn\'t catch anything, but Sang will be quick to remind you, catching isn\'t the only thing fishing is about. Just gotta get out there!',
        link: 'https://www.facebook.com/share/p/1BvH7Ai8PP/'
    },
    {
        name: 'Jimmy Clement',
        date: '12/04/2025',
        avatar: 'assets/images/avt-tes-17.png',
        quote: 'Sang is the best guide in Vietnam. You can tell this isn\'t just a job for Sang but a passion. Fishing for pacific tarpon and barramundi in the mangroves was one of the best days I have had in my 6 years living in Vietnam. Highly recommended!',
        link: 'https://www.facebook.com/share/p/17Pv69oMMq/'
    },
    {
        name: 'Chris James',
        date: '08/04/2025',
        avatar: 'assets/images/avt-tes-18.png',
        quote: 'Sang is the best guide in Vietnam! I was an avid bass and inshore fisherman back home, and didn’t know Vietnam had the same kind of fishing. Then I found Sang, and he put me on all kinds of fish: barramundi, tarpon, peacocks. If you’re anywhere near Saigon, I highly recommend you give Sang a try.',
        link: 'https://www.facebook.com/share/p/1BbBjV25dR/'
    },
    {
        name: 'Dale Watkins',
        date: '07/04/2025',
        avatar: 'assets/images/avt-tes-19.png',
        quote: 'Had a great time fishing with Sang in the mangroves for pacific tarpon and barramundi. I had never expected to find myself fly fishing in Vietnam, but Sang has really done great work promoting the sport and opening it up to visitors. I not only caught some great fish, but got the opportunity to see life off the beaten path in Vietnam. Looking forward to booking with Sang on my next trip and seeing more of the great fly fishing that Vietnam has to offer.',
        link: 'https://www.facebook.com/share/p/17WB172tyP/'
    },
    {
        name: 'Stephen Robinson',
        date: '05/04/2025',
        avatar: 'assets/images/avt-tes-20.png',
        quote: 'An experience that is unforgettable and will have you telling the story time and again. I had an amazing fishing trip. The guides were informative and humorous. I had never been fly fishing before so they provided me with a set up that best fit me. By the end of the trip I also received a patient and thoughtful introduction to fly fishing. I’m still working on my fly casting but I’m definitely hooked!',
        link: 'https://www.facebook.com/share/p/1CM5Bt8Cu2/'
    },
    {
        name: 'Vu Pham',
        date: '05/04/2025',
        avatar: 'assets/images/avt-tes-21.png',
        quote: 'Take the time to enjoy beautiful natural Vietnam. With friendly and experience people to help you have the best time of your life.',
        link: 'https://www.facebook.com/share/p/17KzLQ1NpV/'
    }
];

// ===== RENDER TESTIMONIALS =====
function renderTestimonials() {
    const wrapper = document.querySelector('.testimonials-wrapper');

    if (!wrapper) {
        console.error('Testimonials wrapper not found');
        return;
    }

    // Clear existing content
    wrapper.innerHTML = '';

    // Render each testimonial
    testimonials.forEach(testimonial => {
        // Create testimonial item container
        const item = document.createElement('div');
        item.className = 'testimonial-item';

        // Create avatar
        const avatar = document.createElement('img');
        avatar.className = 'testimonial-item-avatar';
        avatar.src = testimonial.avatar;
        avatar.alt = testimonial.name;

        // Create body container
        const body = document.createElement('div');
        body.className = 'testimonial-item-body';

        // Create author info
        const authorInfo = document.createElement('div');
        authorInfo.className = 'testimonial-item-author-info';

        const name = document.createElement('div');
        name.className = 'testimonial-item-name';
        name.textContent = testimonial.name;

        const date = document.createElement('div');
        date.className = 'testimonial-item-date';
        date.textContent = testimonial.date;

        authorInfo.appendChild(name);
        authorInfo.appendChild(date);

        // Create quote
        const quote = document.createElement('p');
        quote.className = 'testimonial-item-quote';
        quote.textContent = testimonial.quote;

        // Create link
        const linkContainer = document.createElement('div');
        linkContainer.className = 'testimonial-item-link';

        const link = document.createElement('a');
        link.href = testimonial.link;
        link.textContent = testimonial.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        linkContainer.appendChild(link);

        // Assemble body
        body.appendChild(authorInfo);
        body.appendChild(quote);
        body.appendChild(linkContainer);

        // Assemble item
        item.appendChild(avatar);
        item.appendChild(body);

        // Add to wrapper
        wrapper.appendChild(item);
    });
}

// ===== INITIALIZE ON DOM READY =====
document.addEventListener('DOMContentLoaded', renderTestimonials);
