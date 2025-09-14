import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import Particles from '../Animations/Particles';
import AlgoArenaLogo from '../components/AlgoArenaLogo';
import '../global.css';



function ProblemsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all'
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        console.log('Fetched problems:', data);
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        console.log('Fetched solved problems:', data);
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  // Debug effect to log when filters change
  useEffect(() => {
    console.log('Filters changed:', filters);
    console.log('Current problems count:', problems.length);
  }, [filters, problems]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]); // Clear solved problems on logout
  };

  const handleClearFilters = () => {
    console.log('Clearing filters...');
    console.log('Current filters before clear:', filters);
    setFilters({ difficulty: 'all', tag: 'all', status: 'all' });
    console.log('Filters cleared:', { difficulty: 'all', tag: 'all', status: 'all' });

    // Force a re-render by updating state
    setTimeout(() => {
      console.log('Filters after clear (delayed):', filters);
    }, 100);
  };

  const filteredProblems = problems.filter(problem => {
    // Handle difficulty filtering - difficulty is an array
    const difficultyMatch = filters.difficulty === 'all' ||
                          (Array.isArray(problem.difficulty) && problem.difficulty.includes(filters.difficulty)) ||
                          problem.difficulty === filters.difficulty;

    // Handle tags filtering - tags is an array
    const tagMatch = filters.tag === 'all' ||
                    (Array.isArray(problem.tags) && problem.tags.includes(filters.tag)) ||
                    problem.tags === filters.tag;

    // Handle status filtering
    const statusMatch = filters.status === 'all' ||
                      (filters.status === 'solved' && solvedProblems.some(sp => sp._id === problem._id));

    const matches = difficultyMatch && tagMatch && statusMatch;

    // Debug logging for first problem
    if (problem === problems[0]) {
      console.log('Filtering debug for first problem:', {
        problemTitle: problem.title,
        problemDifficulty: problem.difficulty,
        problemTags: problem.tags,
        filters,
        difficultyMatch,
        tagMatch,
        statusMatch,
        matches
      });
    }

    return matches;
  });

  // Debug logging
  console.log('Problems:', problems);
  console.log('Filters:', filters);
  console.log('Filtered Problems:', filteredProblems);

  // Check if filters are active
  const hasActiveFilters = filters.difficulty !== 'all' || filters.tag !== 'all' || filters.status !== 'all';
  console.log('Has active filters:', hasActiveFilters);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navigation Bar */}

      <div style={{ width: '100%', height: '600px', position: 'fixed' }}>
        <Particles
           particleColors={['#ffffff', '#ffffff']}
           particleCount={400}
           particleSpread={10}
           speed={0.1}
           particleBaseSize={100}
           moveParticlesOnHover={true}
           alphaParticles={false}
           disableRotation={false}
        />
      </div>

      <nav className="navbar bg-base-100 shadow-lg px-4">
        <div className="flex-1">
          <AlgoArenaLogo className="btn btn-ghost text-xl" />
        </div>
        <div className="flex-none gap-4">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost">
              {user?.firstName}
            </div>
            <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li><button onClick={handleLogout}>Logout</button></li>
              {user.role=='admin'&&<li><NavLink to="/admin">Admin</NavLink></li>}
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex justify-between items-center w-full mb-2">
            <div className="text-sm text-gray-600">
              Showing {filteredProblems.length} of {problems.length} problems
              {(filters.difficulty !== 'all' || filters.tag !== 'all' || filters.status !== 'all') &&
                ' (filtered)'}
            </div>




          </div>
          {/* New Status Filter */}
          <select
            className="select select-bordered"
            value={filters.status}
            onChange={(e) => {
              console.log('Status changed to:', e.target.value);
              setFilters({...filters, status: e.target.value});
            }}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
          </select>

          <select
            className="select select-bordered"
            value={filters.difficulty}
            onChange={(e) => {
              console.log('Difficulty changed to:', e.target.value);
              setFilters({...filters, difficulty: e.target.value});
            }}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="select select-bordered"
            value={filters.tag}
            onChange={(e) => {
              console.log('Tag changed to:', e.target.value);
              setFilters({...filters, tag: e.target.value});
            }}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>

  <option value="string">String</option>
<option value="linkedList">Linked List</option>
<option value="stack">Stack</option>
<option value="queue">Queue</option>
<option value="hashMap">Hash Map</option>
<option value="hashSet">Hash Set</option>

<option value="binaryTree">Binary Tree</option>
<option value="binarySearchTree">Binary Search Tree</option>
<option value="tree">Tree</option>
<option value="graph">Graph</option>
<option value="dfs">DFS</option>
<option value="bfs">BFS</option>
<option value="topologicalSort">Topological Sort</option>

<option value="recursion">Recursion</option>
<option value="backtracking">Backtracking</option>

<option value="dp">DP</option>
<option value="memoization">Memoization</option>
<option value="tabulation">Tabulation</option>
<option value="knapsack">Knapsack</option>
<option value="lcs">LCS</option>
<option value="lis">LIS</option>

<option value="greedy">Greedy</option>

<option value="math">Math</option>
<option value="prime">Prime</option>
<option value="gcd">GCD</option>
<option value="lcm">LCM</option>
<option value="combinatorics">Combinatorics</option>
<option value="geometry">Geometry</option>
<option value="modulo">Modulo</option>

<option value="binarySearch">Binary Search</option>
<option value="twoPointers">Two Pointers</option>
<option value="slidingWindow">Sliding Window</option>
<option value="mergeSort">Merge Sort</option>
<option value="quickSort">Quick Sort</option>
<option value="countingSort">Counting Sort</option>

<option value="bitManipulation">Bit Manipulation</option>

<option value="kmp">KMP</option>
<option value="manacher">Manacher</option>
<option value="trie">Trie</option>
<option value="stringMatching">String Matching</option>

<option value="heap">Heap</option>
<option value="priorityQueue">Priority Queue</option>

<option value="dijkstra">Dijkstra</option>
<option value="floydWarshall">Floyd Warshall</option>
<option value="bellmanFord">Bellman Ford</option>
<option value="kruskal">Kruskal</option>
<option value="prim">Prim</option>
<option value="unionFind">Union Find</option>
<option value="disjointSet">Disjoint Set</option>

<option value="intervals">Intervals</option>
<option value="sweepLine">Sweep Line</option>

<option value="geometry">Geometry</option>
<option value="convexHull">Convex Hull</option>

<option value="simulation">Simulation</option>
<option value="design">Design</option>
<option value="monotonicStack">Monotonic Stack</option>
<option value="monotonicQueue">Monotonic Queue</option>
<option value="prefixSum">Prefix Sum</option>
<option value="differenceArray">Difference Array</option>

<option value="segmentTree">Segment Tree</option>
<option value="fenwickTree">Fenwick Tree</option>
<option value="lineSweep">Line Sweep</option>
<option value="divideAndConquer">Divide and Conquer</option>
<option value="rollingHash">Rolling Hash</option>
<option value="suffixArray">Suffix Array</option>

<option value="oop">OOP</option>
<option value="concurrency">Concurrency</option>


          </select>
        </div>

        {/* Problems List */}
        <div className="grid gap-4">
          {filteredProblems.map(problem => (
            <div key={problem._id} className="card bg-base-100 shadow-xl gradientt rounded-4xl card1">
              <div className="card-body ">
                <div className="flex items-center justify-between">
                  <h2 className="card-title">
                    <NavLink to={`/problem/${problem._id}`} className="hover:text-primary">
                      {problem.title}
                    </NavLink>
                  </h2>
                  {Array.isArray(solvedProblems) && solvedProblems.some(sp => sp._id === problem._id) && (
                    <div className="badge gap-2 rounded-[50px]  tagColor">

                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Solved
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)} tagColor glowText1`}>
                      {problem.difficulty}
                      <div id="container-stars">
                       <div id="stars"></div>
                      </div>
                  </div>

                  <div className={`badge badge-info ${getDifficultyBadgeColor(problem.difficulty)} tagColor glowText2`}>
                      {problem.tags}
                      <div id="container-stars">
                       <div id="stars"></div>
                      </div>
                  </div>


                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty[0].toLowerCase()) {
    case 'easy': return 'easy';
    case 'medium': return 'medium';
    case 'hard': return 'hard';
    default: return 'badge-neutral';
  }
};

export default ProblemsPage;
