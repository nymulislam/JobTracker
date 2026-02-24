let jobStatus = [];

const loadJobs = () => {
    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            allJobs = data;
            displayJobs(data)
        })
}

const displayJobs = (jobs) => {
    const jobsContainer = document.getElementById("jobs-container")

    // Display No-Jobs card conditionally
    const noJobsCard = document.getElementById("no-jobs");
    if (jobs.length === 0) {
        noJobsCard.classList.remove('hidden')
    }

    document.addEventListener('click', function (e) {
        const tabBtn = e.target.closest(".tab-btn")
        const interview = e.target.closest(".interview-btn")
        const reject = e.target.closest(".reject-btn")

        // Change card status
        if (interview || reject) {
            const jobCard = e.target.closest('.job-card')
            const jobId = Number(jobCard.dataset.id)
            const job = jobs.find(j => j.id === jobId)

            let existingJob = jobStatus.find(j => j.id === jobId)

            if (!existingJob) {
                jobStatus.push(job)
                existingJob = job
            }

            // Update Status
            if (interview) {
                existingJob.status = 'Interview'
            }
            if (reject) {
                existingJob.status = 'Reject'
            }

            const interviewed = jobStatus.filter(j => j.status === 'Interview')
            const rejected = jobStatus.filter(j => j.status === 'Reject')

            document.getElementById("interview-count").innerText = interviewed.length;
            document.getElementById("reject-count").innerText = rejected.length;

            // Change status on behavior
            const changeStatus = jobCard.querySelector('.change-status');

            if (existingJob.status === 'Interview') {
                changeStatus.innerText = `INTERVIEW`
                changeStatus.classList.add('text-green-500', 'bg-green-100', 'border-l-3', 'font-bold')
                changeStatus.classList.remove('text-red-500', 'bg-red-100')
            }
            if (existingJob.status === 'Reject') {
                changeStatus.innerText = `REJECTED`
                changeStatus.classList.add('text-red-500', 'bg-red-100', 'border-l-3', 'font-bold')
                changeStatus.classList.remove('text-green-500', 'bg-green-100')
            }
        }

        // Tab btn change conditionally
        if (!tabBtn) return;
        document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("btn-active"))
        tabBtn.classList.add("btn-active");
        if (tabBtn.innerText === 'All') {
            if (jobs.length === 0) {
                noJobsCard.classList.remove('hidden')
            } else {
                noJobsCard.classList.add('hidden')
                loadJobs()
            }
        }
        if (tabBtn.innerText === 'Interview') {
            jobsContainer.innerHTML = " ";
            if (interviewed.length === 0) {
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
        const jobsCard = document.createElement("div")
        jobsCard.innerHTML = `
        <div data-id=${job.id} class="job-card space-y-3 shadow-sm p-8 rounded-md">
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
                    <h3 class="px-4 py-2 mt-3 shadow-sm w-fit rounded-md change-status">NOT APPLIED</h3>
                    <p>${job.description}</p>
                    <div class="space-x-4">
                        <button class="btn btn-success btn-soft interview-btn shadow-sm">
                            Interview
                        </button>
                        <button class="btn btn-error btn-soft reject-btn shadow-sm">
                            Reject
                        </button>
                    </div>
                </div>
        `
        jobsContainer.append(jobsCard);
    }
}

loadJobs()