const loadJobs = () => {
    fetch('data.json')
        .then(res => res.json())
        .then(data => displayJobs(data))
}

const interviewJobs = [];
const rejectedJobs = [];

const displayJobs = (jobs) => {
    const jobsContainer = document.getElementById("jobs-container")

    // Display No-Jobs card conditionally
    const noJobsCard = document.getElementById("no-jobs");

    if (jobs.length === 0) {
        noJobsCard.classList.remove('hidden')
    }

    document.addEventListener('click', function (e) {
        const tabBtn = e.target.closest(".tab-btn")
        const interviewBtn = e.target.closest('.interview-btn')
        const rejectBtn = e.target.closest('.reject-btn')

        const appliedStatus = document.getElementById("applied-status")

        if(interviewBtn){
            appliedStatus.innerText = `INTERVIEW`
            appliedStatus.classList.add('text-green-500', 'bg-green-100', 'border-l-3', 'font-bold')
            appliedStatus.classList.remove('text-red-500', 'bg-red-100')
        } else if(rejectBtn){
            appliedStatus.innerText = `REJECTED`
            appliedStatus.classList.add('text-red-500', 'bg-red-100', 'border-l-3', 'font-bold')
        }

        if (!tabBtn) return;

        document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("btn-active"))

        tabBtn.classList.add("btn-active");

        if (tabBtn.innerText === 'All') {
            if (jobs.length === 0) {
                noJobsCard.classList.remove('hidden')
            }
            loadJobs()
        };

        if (tabBtn.innerText === 'Interview') {
            jobsContainer.innerHTML = " ";
            if (interviewJobs.length === 0) {
                noJobsCard.classList.remove('hidden')
            }
        }

        if (tabBtn.innerText === 'Rejected') {
            jobsContainer.innerHTML = " ";

            if (rejectedJobs.length === 0) {
                noJobsCard.classList.remove('hidden')
            }
        }
    })

    // Display total jobs count
    document.getElementById("total-jobs").innerText = jobs.length;
    document.getElementById("available-jobs").innerText = jobs.length;

    jobsContainer.innerHTML = "";
    for (const job of jobs) {
        // console.log(job)
        const jobsCard = document.createElement("div")
        jobsCard.innerHTML = `
        <div class="space-y-3 shadow-sm p-8 rounded-md">
                    <div class="flex justify-between">
                        <div>
                            <h2 class="text-2xl font-semibold">${job.companyName}</h2>
                            <h4 class="text-lg opacity-65">${job.position}</h4>
                        </div>
                        <button class="btn btn-circle btn-error btn-outline hover:text-white">
                            <i class="fa-solid fa-trash text-lg"></i>
                        </button>
                    </div>
                    <ol class="list-disc list-inside inline">
                        <li>${job.location}</li>
                        <li>${job.type}</li>
                        <li>${job.salary}</li>
                    </ol>
                    <h3 id="applied-status" class="px-4 py-2 mt-3 shadow-sm w-fit rounded-md">NOT APPLIED</h3>
                    <p>${job.description}</p>
                    <div>
                        <button class="btn btn-success btn-soft interview-btn">
                            interview
                        </button>
                        <button class="btn btn-error btn-soft reject-btn">
                            reject
                        </button>
                    </div>
                </div>
        `
        jobsContainer.append(jobsCard);
    }
}

loadJobs()